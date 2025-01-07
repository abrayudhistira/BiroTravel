const Transaksi = require('../models/Transaksi');
const PaketBundling = require('../models/PaketBundling');
const User = require('../models/Users');
const fs = require('fs');

exports.createTransaksi = async(req, res) => {
    try {
        console.log("Request Body:", req.body); // Periksa data yang dikirimkan
        console.log("Uploaded File:", req.file); // Periksa file yang diupload
        // Ambil id pengguna, ID_Paket, dan Jumlah_Pembayaran dari request
        const { id, ID_Paket, Jumlah_Pembayaran, jenis_pembayaran } = req.body;

        // Periksa jika id tidak ada
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Menyimpan file bukti pembayaran
        const buktiPembayaran = req.file ? req.file.path : null; // Ambil path file jika ada

        // Membuat transaksi baru
        const transaksi = await Transaksi.create({
            id, // id yang merujuk pada User
            ID_Paket, // ID Paket yang dipilih
            Jumlah_Pembayaran, // Jumlah pembayaran
            jenis_pembayaran,
            Bukti_Pembayaran: buktiPembayaran, // Path bukti pembayaran
        });

        res.status(201).json({ message: 'Transaksi berhasil dibuat', transaksi });
    } catch (error) {
        console.error('Error creating transaksi:', error);
        res.status(500).json({ message: 'Error creating transaksi', error: error.message });
    }
};
// Fungsi untuk menampilkan detail transaksi
exports.showTransaksi = async(req, res) => {
    try {
        const transaksi = await Transaksi.findOne({
            where: { ID_Transaksi: req.params.id },
            include: [User, PaketBundling],
        });

        res.render('user/transaksi', { transaksi });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching transaksi details.');
    }
};