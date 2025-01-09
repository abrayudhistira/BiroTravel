const express = require('express');
const { showRiwayatTransaksi, createTransaksi } = require('../controllers/transaksiController');
const { authenticate } = require('../middlewares/auth'); // Middleware for user authentication
const multer = require('multer');

// Multer configuration for storing files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Route for adding a new transaction (user-specific)
router.post('/transaksi/new', authenticate, upload.single('Bukti_Pembayaran'), createTransaksi);
// Route untuk melihat riwayat transaksi
router.get('/riwayat-transaksi', showRiwayatTransaksi);


module.exports = router;