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
const adminController = require('../controllers/adminController');


// Konfigurasi multer untuk menyimpan file di memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/:id/deletePage', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    const transaksi = await Transaksi.findByPk(id);

    if (!transaksi) {
        console.log("Transaksi tidak ditemukan");
        return res.status(404).send('Transaksi tidak ditemukan.');
    }

    // Convert Bukti_Pembayaran to Base64 if available
    const buktiBase64 = transaksi.Bukti_Pembayaran
        ? transaksi.Bukti_Pembayaran.toString('base64')
        : null;

    // Pass Base64 image to template
    res.render('admin/deletePage', {
        transaksi: {
            ...transaksi.get({ plain: true }),
            Bukti_Pembayaran: buktiBase64
        }
    });
});


router.post('/:id/deletePage', authenticate, isAdmin, async(req, res) => {
    const { id } = req.params;
    const transaksi = await Transaksi.findByPk(id);
    if (!transaksi) {
        return res.status(404).send('Transaksi tidak ditemukan.');
    }

    await transaksi.destroy();
    console.log('Transaksi berhasil dihapus');

    res.redirect('/admin/dashboardadmin');
});

module.exports = router;