const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const multer = require('multer');
const User = require('../models/Users'); // Pastikan path ini sesuai dengan struktur folder proyek Anda
const PaketBundling = require('../models/PaketBundling'); // Pastikan path ini sesuai dengan struktur folder proyek Anda
const Transaksi = require('../models/Transaksi'); // Pastikan path ini sesuai dengan struktur folder proyek Anda
const {deleteTransaksi} = require('../controllers/transaksiController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { getAllTransaksi } = require('../controllers/transaksiController');


// Konfigurasi multer untuk menyimpan file di memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route untuk membuat transaksi
// router.post('/transaksi', upload.single('Bukti_Pembayaran'), transaksiController.createTransaksi);
// Menggunakan middleware multer dalam rute
// router.post('/transaksi', upload.single('Bukti_Pembayaran'), async(req, res) => {
//     const { id, ID_Paket } = req.body;

//     // Cek jika file Bukti_Pembayaran ada dalam req.files
//     if (!req.file) {
//         return res.status(400).send('File Bukti Pembayaran harus diupload.');
//     }

//     // Ambil data pengguna dan paket bundling
//     const user = await User.findByPk(id);
//     const paket = await PaketBundling.findByPk(ID_Paket);

//     // Pastikan data paket dan user ada
//     if (!user || !paket) {
//         return res.status(400).send('User atau Paket tidak ditemukan.');
//     }

//     const Jumlah_Pembayaran = paket.Harga;

//     // Validasi jika harga paket tidak ada
//     if (!Jumlah_Pembayaran) {
//         return res.status(400).send('Harga paket tidak ditemukan.');
//     }

//     try {
//         // Simpan transaksi ke dalam database
//         const transaksi = await Transaksi.create({
//             id: user.id,
//             ID_Paket: paket.ID_Paket,
//             Jumlah_Pembayaran: Jumlah_Pembayaran,
//             jenis_pembayaran: 'cash',
//             Bukti_Pembayaran: req.file.buffer // Memasukkan file yang diupload sebagai buffer
//         });

//         // Redirect atau kirim respons sukses
//         res.redirect('/user/dashboard');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error creating transaksi.');
//     }
// });
// Route to view all transactions (admin-specific)
router.get('/transaksi', authenticate, isAdmin, getAllTransaksi);

// Route untuk melihat detail transaksi
router.get('/transaksi/:id', transaksiController.showTransaksi);
// Route untuk menghapus transaksi
router.post('/transaksi/:id/delete', authenticate, isAdmin, deleteTransaksi);

module.exports = router;