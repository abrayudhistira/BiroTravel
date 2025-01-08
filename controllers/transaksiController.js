const Transaksi = require('../models/Transaksi');
const PaketBundling = require('../models/PaketBundling');
const User = require('../models/Users');
const fs = require('fs');


exports.createTransaksi = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Periksa data yang dikirimkan
        console.log("Uploaded File:", req.file); // Periksa file yang diupload

        // Ambil id pengguna dan ID_Paket dari request
        const { id, ID_Paket } = req.body;

        // Periksa jika id tidak ada
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Cek jika file Bukti_Pembayaran ada dalam req.file
        if (!req.file) {
            return res.status(400).json({ message: 'File Bukti Pembayaran harus diupload.' });
        }

        // Ambil data pengguna dan paket bundling
        const user = await User.findByPk(id);
        const paket = await PaketBundling.findByPk(ID_Paket);

        // Pastikan data paket dan user ada
        if (!user || !paket) {
            return res.status(400).json({ message: 'User atau Paket tidak ditemukan.' });
        }

        const Jumlah_Pembayaran = paket.Harga;

        // Validasi jika harga paket tidak ada
        if (!Jumlah_Pembayaran) {
            return res.status(400).json({ message: 'Harga paket tidak ditemukan.' });
        }

        // Membuat transaksi baru
        const transaksi = await Transaksi.create({
            id: user.id, // id yang merujuk pada User
            ID_Paket: paket.ID_Paket, // ID Paket yang dipilih
            Jumlah_Pembayaran: Jumlah_Pembayaran, // Jumlah pembayaran
            jenis_pembayaran: 'cash', // Default to 'cash'
            Bukti_Pembayaran: req.file.buffer, // Simpan file sebagai buffer
        });

        // Redirect atau kirim respons sukses
        res.redirect('/user/dashboard');
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

// exports.deleteTransaksi = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await Transaksi.destroy({ where: { ID_Transaksi: id } });
//         res.redirect('/admin/transaksi');
//     } catch (err) {
//         console.error('Error deleting transaction:', err);
//         res.status(500).send('Error deleting transaction.');
//     }
// };

exports.deleteTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.findByPk(req.params.id);
        if (!transaksi) return res.status(404).send('Transaction not found.');

        await transaksi.destroy();
        res.redirect('/admin/transaksi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting transaction.');
    }
};

// Get all transactions (admin-specific)
exports.getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.findAll();
        res.render('admin/transaksi', { transaksi });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).send('Error fetching transactions.');
    }
};