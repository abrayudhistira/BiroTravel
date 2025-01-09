const express = require('express');
const {
    showLogin,
    showRegister,
    showDashboard,
    login,
    register
} = require('../controllers/userController');
const {
    showKeranjang,
    addToKeranjang,
    removeFromKeranjang
} = require('../controllers/keranjangController');
const router = express.Router();
const Transaksi = require('../models/Transaksi');
const PaketBundling = require('../models/PaketBundling');
const User = require('../models/Users');
const Keranjang = require('../models/Keranjang'); // Tambahkan baris ini
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('bukti_pembayaran');

// Route to show login page
router.get('/login', showLogin);
// Route to handle login
router.post('/login', login);

// Route to show register page
router.get('/register', showRegister);
// Route to handle user registration
router.post('/register', register);

// Route to show user dashboard
// router.get('/dashboard', async(req, res) => {
//     const user = req.session.user;
//     if (!user) {
//         return res.redirect('/user/login');
//     }
//     try {
//         const paket = await PaketBundling.findAll();
//         res.render('user/dashboard', { user, paket });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error fetching paket data');
//     }
// });
router.get('/dashboard', async(req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }
    try {
        const paket = await PaketBundling.findAll();
        const keranjangCount = await Keranjang.count({ where: { id: user.id } });

        res.render('user/dashboard', {
            user,
            paket,
            keranjangCount // Kirim jumlah item ke tampilan
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching paket data');
    }
});


// Route to logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error during logout.');
        }
        res.redirect('/user/login');
    });
});

// router.get('/keranjang', (req, res) => {
//     const user = req.session.user;
//     if (!user) {
//         return res.redirect('/user/login');
//     }
//     const paket = []; // Ambil data paket dari database atau session sesuai kebutuhan
//     res.render('user/keranjang', { user, paket });
// });

// Keranjang routes
router.get('/keranjang', showKeranjang);
router.post('/keranjang/add', addToKeranjang);
//router.post('/keranjang/remove/:id', removeFromKeranjang);
// Route untuk menghapus item dari keranjang berdasarkan keranjang_id
router.delete('/keranjang/remove/:keranjang_id', async(req, res) => {
    const { keranjang_id } = req.params; // Ambil keranjang_id dari parameter URL
    const user = req.session.user; // Dapatkan user dari session

    if (!user) {
        return res.redirect('/user/login'); // Jika user tidak ada, redirect ke login
    }

    try {
        // Cari item keranjang berdasarkan keranjang_id dan user.id
        const item = await Keranjang.findOne({
            where: { keranjang_id, id: user.id } // Mencari berdasarkan keranjang_id dan user.id
        });

        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' }); // Mengirimkan JSON jika item tidak ditemukan
        }

        // Hapus item dari keranjang
        await item.destroy();

        res.status(200).json({ message: 'Item berhasil dihapus' }); // Kirim response JSON jika item berhasil dihapus
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error removing item from keranjang' }); // Kirim response error dalam JSON
    }
});

router.get('/transaksi', async(req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/user/login');
        }

        const keranjang = await Keranjang.findAll({
            where: { id: user.id },
            include: [{
                model: PaketBundling,
                as: 'PaketBundling',
                attributes: ['Nama_paket', 'Harga']
            }]
        });

        if (!keranjang || keranjang.length === 0) {
            return res.render('user/pembayaran', {
                user,
                totalPembayaran: 0,
                paket: []
            });
        }

        const totalPembayaran = keranjang.reduce(
            (total, item) => total + (item.PaketBundling.Harga * item.Jumlah),
            0
        );

        res.render('user/pembayaran', {
            user,
            paket: keranjang,
            totalPembayaran
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching pembayaran data.');
    }
});

router.post('/confirm-pembayaran', upload, async(req, res) => {
    try {
        const { jenis_pembayaran, totalPembayaran } = req.body;
        const userId = req.session.user ? req.session.user.id : null;

        if (!userId) {
            return res.status(401).send('User tidak valid. Silakan login kembali.');
        }

        if (!jenis_pembayaran) {
            return res.status(400).send('Jenis pembayaran harus diisi.');
        }

        const keranjang = await Keranjang.findAll({
            where: { id: userId },
            include: ['PaketBundling']
        });

        if (!keranjang.length) {
            return res.status(400).send('Keranjang kosong.');
        }

        for (const item of keranjang) {
            // Menyimpan bukti pembayaran dalam bentuk BLOB jika ada
            let buktiPembayaran = null;
            if (req.file) {
                buktiPembayaran = req.file.buffer; // Menyimpan buffer file yang di-upload
            }

            // Menyimpan data transaksi ke database
            await Transaksi.create({
                ID_Paket: item.ID_Paket,
                Jumlah_Pembayaran: item.PaketBundling.Harga * item.Jumlah,
                jenis_pembayaran: jenis_pembayaran,
                id: userId,
                Bukti_Pembayaran: buktiPembayaran
            });
        }

        // Menghapus item dari keranjang setelah transaksi berhasil
        await Keranjang.destroy({ where: { id: userId } });

        res.redirect('/user/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses pembayaran.');
    }
});

module.exports = router;