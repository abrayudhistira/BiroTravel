const express = require('express');
const {
    showLogin,
    showRegister,
    showDashboard,
    login,
    register
} = require('../controllers/userController');
const router = express.Router();
const Transaksi = require('../models/Transaksi');
const PaketBundling = require('../models/PaketBundling');
const User = require('../models/Users');

// Route to show login page
router.get('/login', showLogin);
// Route to handle login
router.post('/login', login);

// Route to show register page
router.get('/register', showRegister);
// Route to handle user registration
router.post('/register', register);

// Route to show user dashboard
router.get('/dashboard', async(req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }
    try {
        const paket = await PaketBundling.findAll();
        res.render('user/dashboard', { user, paket });
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

router.get('/keranjang', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }
    const paket = []; // Ambil data paket dari database atau session sesuai kebutuhan
    res.render('user/keranjang', { user, paket });
});

router.post('/transaksi', async(req, res) => {
    const { ID_Paket } = req.body;
    const user = req.session.user; // Akses user langsung dari session

    // Pastikan ada user di session
    if (!user) {
        return res.redirect('/user/login'); // Jika tidak ada user, redirect ke login
    }

    try {
        // Ambil paket yang dipilih dari database
        const paket = await PaketBundling.findByPk(ID_Paket);

        // Hitung jumlah pembayaran
        const Jumlah_Pembayaran = paket.Harga;

        // Kirim data user, paket, dan jumlah pembayaran ke view konfirmasiTransaksi
        res.render('user/konfirmasiTransaksi', {
            user,
            paket,
            Jumlah_Pembayaran
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding paket to cart');
    }
});

// Route untuk konfirmasi transaksi
router.post('/confirmtransaksi', async(req, res) => {
    const { id, ID_Paket } = req.body;

    // Ambil data pengguna dan paket bundling
    const user = await User.findByPk(id);
    const paket = await PaketBundling.findByPk(ID_Paket);

    // Pastikan data paket dan user ada
    if (!user || !paket) {
        return res.status(400).send('User atau Paket tidak ditemukan.');
    }

    const Jumlah_Pembayaran = paket.Harga;

    // Validasi jika harga paket tidak ada
    if (!Jumlah_Pembayaran) {
        return res.status(400).send('Harga paket tidak ditemukan.');
    }

    try {
        // Simpan transaksi
        const transaksi = await Transaksi.create({
            id: user.id,
            ID_Paket: paket.ID_Paket,
            Jumlah_Pembayaran: Jumlah_Pembayaran,
            Bukti_Pembayaran: req.files.Bukti_Pembayaran.data
        });

        // Redirect ke dashboard
        res.redirect('/user/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating transaksi.');
    }
});


// Route for transaction history
router.get('/riwayat-transaksi', async(req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }
    try {
        const transaksi = await Transaksi.findAll({
            where: { id: user.id },
            include: [{ model: PaketBundling, attributes: ['Nama_paket', 'Harga'] }]
        });
        res.render('user/riwayatTransaksi', { user, transaksi });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching transaction history.');
    }
});

module.exports = router;