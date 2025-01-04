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

// Route to show user dashboard (only for logged-in users)
//router.get('/dashboard', showDashboard);
// Route untuk menampilkan dashboard pengguna
// Route untuk menampilkan dashboard pengguna
router.get('/dashboard', async (req, res) => {
    const user = req.session.user;

    // Cek apakah ada user di session
    if (!user) {
        return res.redirect('/user/login');  // Jika tidak ada user, redirect ke login
    }

    try {
        // Ambil daftar paket bundling dari database
        const paket = await PaketBundling.findAll();

        // Tampilkan halaman dashboard dengan data user dan paket
        res.render('user/dashboard', { user, paket });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching paket data');
    }
});



// Route to logout (destroy session)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => { 
        if (err) {
            return res.status(500).send('Error during logout.');
        }
        res.redirect('/user/login');
    }); 
});

// router.post('/keranjang', async (req, res) => {
//     const { ID_Paket } = req.body;
//     const userId = req.session.userId; // Pastikan id pengguna ada di session
  
//     try {
//       // Ambil data pengguna dari database menggunakan userId
//       const user = await User.findByPk(userId);
  
//       // Ambil paket yang dipilih dari database
//       const paket = await PaketBundling.findByPk(ID_Paket);
  
//       // Hitung jumlah pembayaran
//       const Jumlah_Pembayaran = paket.Harga;
  
//       // Kirim data user, paket, dan jumlah pembayaran ke view konfirmasiTransaksi
//       res.render('user/konfirmasiTransaksi', {
//         user,
//         paket,
//         Jumlah_Pembayaran
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error adding paket to cart');
//     }
// });
  
router.post('/keranjang', async (req, res) => {
    const { ID_Paket } = req.body;
    const user = req.session.user; // Akses user langsung dari session
  
    // Pastikan ada user di session
    if (!user) {
        return res.redirect('/user/login');  // Jika tidak ada user, redirect ke login
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
router.post('/transaksi', async (req, res) => {
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

// Route untuk Riwayat Transaksi berdasarkan user ID
router.get('/riwayat-transaksi', async (req, res) => {
    const user = req.session.user;  // Mengambil user yang sedang login
    
    // Pastikan user ada di session
    if (!user) {
        return res.redirect('/user/login');  // Redirect ke halaman login jika tidak ada user
    }

    try {
        // Ambil riwayat transaksi berdasarkan user id
        const transaksi = await Transaksi.findAll({
            where: { id: user.id },  // Filter berdasarkan id user
            include: [
                { model: PaketBundling,
                  attributes: ['Nama_paket', 'Harga'],
                  required: true //Pastikan hanya transaksi yang memiliki paket yang ditampilkan
                 },  // Include PaketBundling untuk menampilkan nama dan harga paket
            ],
        });

        // Render halaman dengan data transaksi
        res.render('user/riwayatTransaksi', {
            user,
            transaksi,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching transaction history.');
    }
});


module.exports = router;
