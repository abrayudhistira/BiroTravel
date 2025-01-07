const fs = require('fs');
const PaketBundling = require('../models/PaketBundling');

// Menampilkan semua paket bundling
exports.getAllPaket = async (req, res) => {
  try {
    const paket = await PaketBundling.findAll();
    res.render('paket/list', { paket });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching paket bundling data.');
  }
};

// Menampilkan form tambah paket
exports.showAddForm = (req, res) => {
  res.render('admin/newPaket', { title: 'Add New Paket' });
};

// Updated Menambahkan paket bundling baru
exports.addPaket = async (req, res) => {
  try {
      const { Nama_paket, Deskripsi, Harga } = req.body;
      let Gambar = null;

      if (req.file) {
          Gambar = fs.readFileSync(req.file.path); // Read the uploaded file as a BLOB
      }

      // Create the new package
      await PaketBundling.create({ Nama_paket, Deskripsi, Harga, Gambar });

      // Delete the temporary file after saving
      if (req.file) fs.unlinkSync(req.file.path);

      res.redirect('/admin/paket');
  } catch (err) {
      console.error('Error adding paket bundling:', err);
      res.status(500).send('Error adding paket bundling.');
  }
};

// Menampilkan form edit paket
exports.showEditForm = async (req, res) => {
  try {
    const paket = await PaketBundling.findByPk(req.params.id);
    if (!paket) {
      return res.status(404).send('Paket not found.');
    }
    res.render('admin/editPaket', { paket });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching paket.');
  }
};

// Mengedit paket bundling
exports.editPaket = async (req, res) => {
  try {
    const { Nama_paket, Deskripsi, Harga } = req.body;
    const updateData = { Nama_paket, Deskripsi, Harga };

    if (req.file) {
      updateData.Gambar = fs.readFileSync(req.file.path); // Jika ada gambar baru, update dengan gambar baru
    }

    await PaketBundling.update(updateData, { where: { ID_Paket: req.params.id } });

    if (req.file) fs.unlinkSync(req.file.path); // Hapus file sementara setelah disimpan

    res.redirect('/admin/paket');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating paket bundling.');
  }
};

// Menghapus paket bundling
exports.deletePaket = async (req, res) => {
  try {
    await PaketBundling.destroy({ where: { ID_Paket: req.params.id } });
    res.redirect('/admin/paket');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting paket bundling.');
  }
};

// Mengupdate paket
exports.updatePaket = async (req, res) => {
  try {
      const { Nama_paket, Deskripsi, Gambar, Harga } = req.body;
      const paket = await PaketBundling.findByPk(req.params.id);
      if (!paket) return res.status(404).send('Paket not found.');

      await paket.update({ Nama_paket, Deskripsi, Gambar, Harga });
      res.redirect('/admin/dashboard');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating paket bundling.');
  }
};
