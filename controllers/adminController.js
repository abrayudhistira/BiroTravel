const bcrypt = require('bcrypt');
const User = require('../models/Users');
const fs = require('fs');
const session = require('express-session');
const PaketBundling = require('../models/PaketBundling');

// Controller for showing login form
exports.showLoginAdmin = (req, res) => {
    res.render('admin/loginadmin', { title: 'Admin Login' });
};

// Controller for handling login form submission
exports.loginadmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Log the received data
        console.log('Received username:', username);
        
        // Find user by username
        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid username or password');
        }

        // If valid, store user data in session
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        // Redirect to the admin dashboard
        res.redirect('/admin/dashboardadmin');  // Ensure this route matches your routing
    } catch (err) {
        console.error('Error during login:', err);  // Log the error
        res.status(500).send('Internal server error');
    }
};

exports.showDashboard = async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            // Fetch all users from the database
            const users = await User.findAll();

            // Render the dashboard page and pass the users to the view
            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                users: users
            });
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Internal server error');
        }
    } else {
        res.status(403).send('Access denied');
    }
};

// Controller for showing the admin page
exports.showAdminPage = (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.render('admin/admin', { title: 'Admin Page' });
    } else {
        res.status(403).send('Access denied');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out');
        }
        res.redirect('/admin/adminlogin'); // Redirect to login page after logout
    });
};

// Menampilkan dashboard admin
exports.showAdminDashboard = (req, res) => {
    res.render('admin/dashboard', { user: req.session.user });
};

// Menambahkan paket baru (admin)
exports.createPaket = async (req, res) => {
    try {
      const { Nama_paket, Deskripsi, Harga } = req.body;
      let Gambar = null;
  
      if (req.file) {
        Gambar = fs.readFileSync(req.file.path); // Membaca file gambar sebagai BLOB
      }
  
      await PaketBundling.create({ Nama_paket, Deskripsi, Harga, Gambar });
  
      // Hapus file sementara setelah tersimpan
      if (req.file) fs.unlinkSync(req.file.path);
  
      res.redirect('/admin/paket');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding paket bundling.');
    }
};
// Menampilkan semua paket bundling
exports.getAllPaket = async (req, res) => {
    try {
      const paket = await PaketBundling.findAll();
      res.render('paket/list', { paket });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching paket bundling data.');
    }
};;

exports.getPaketById = async (req, res) => {
    try {
      const paket = await PaketBundling.findByPk(req.params.id);
  
      if (!paket) {
        return res.status(404).send('Paket not found.');
      }
  
      const gambarBase64 = paket.Gambar ? paket.Gambar.toString('base64') : null;
  
      res.render('paket/detail', { paket, gambarBase64 });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching paket.');
    }
};;

exports.updatePaket = async (req, res) => {
    try {
        const paketId = req.params.id;
        const { Nama_paket, Deskripsi, Harga } = req.body;
        const gambar = req.files ? req.files.Gambar : null;

        const paket = await PaketBundling.findByPk(paketId);
        if (!paket) {
            return res.status(404).send('Paket not found.');
        }

        // Update fields
        paket.Nama_paket = Nama_paket;
        paket.Deskripsi = Deskripsi;
        paket.Harga = Harga;

        if (gambar) {
            paket.Gambar = gambar.data;
        }

        await paket.save();
        res.redirect('/admin/paket'); // Redirect ke daftar paket setelah update
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating paket.');
    }
};


// Menghapus paket
exports.deletePaket = async (req, res) => {
    try {
        const paket = await PaketBundling.findByPk(req.params.id);
        if (!paket) return res.status(404).send('Paket not found.');

        await paket.destroy();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting paket bundling.');
    }
};