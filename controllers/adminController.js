const bcrypt = require('bcrypt');
const User = require('../models/Users');
const fs = require('fs');
const session = require('express-session');
const PaketBundling = require('../models/PaketBundling');
const Transaksi = require('../models/Transaksi'); // Adjust the path if necessary

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
// Update the showDashboard controller with base64 conversion
exports.showDashboard = async (req, res) => {
    try {
        const users = await User.findAll();
        const transaksi = await Transaksi.findAll();

        // Convert Bukti_Pembayaran (BLOB) to Base64 for each transaction
        const transaksiWithBase64 = transaksi.map(transaksi => {
            const buktiBase64 = transaksi.Bukti_Pembayaran ? transaksi.Bukti_Pembayaran.toString('base64') : null;
            return {
                ...transaksi.get({ plain: true }),
                Bukti_Pembayaran: buktiBase64
            };
        });

        res.render('admin/dashboard', { title: 'Admin Dashboard', users, transaksi: transaksiWithBase64 });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).send('Internal server error');
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

// // Update Menambahkan paket baru (admin)
// exports.createPaket = async (req, res) => {
//     try {
//         const { Nama_paket, Deskripsi, Harga } = req.body;
//         let Gambar = null;

//         // Log the received data for debugging
//         console.log('Received data:', { Nama_paket, Deskripsi, Harga });

//         if (req.file) {
//             Gambar = fs.readFileSync(req.file.path); // Read the uploaded file as a BLOB
//             console.log('File uploaded:', req.file);
//         }

//         // Create the new package
//         await PaketBundling.create({ Nama_paket, Deskripsi, Harga, Gambar });

//         // Delete the temporary file after saving
//         if (req.file) fs.unlinkSync(req.file.path);

//         res.redirect('/admin/paket');
//     } catch (err) {
//         console.error('Error adding paket bundling:', err);
//         res.status(500).send('Error adding paket bundling.');
//     }
// };
// // Menampilkan semua paket bundling
// exports.getAllPaket = async (req, res) => {
//     try {
//       const paket = await PaketBundling.findAll();
//       res.render('paket/list', { paket });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error fetching paket bundling data.');
//     }
// };;

// exports.getPaketById = async (req, res) => {
//     try {
//       const paket = await PaketBundling.findByPk(req.params.id);
  
//       if (!paket) {
//         return res.status(404).send('Paket not found.');
//       }
  
//       const gambarBase64 = paket.Gambar ? paket.Gambar.toString('base64') : null;
  
//       res.render('paket/detail', { paket, gambarBase64 });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error fetching paket.');
//     }
// };;

// // Mengupdate paket
// exports.updatePaket = async (req, res) => {
//     try {
//         const { Nama_paket, Deskripsi, Gambar, Harga } = req.body;
//         const paket = await PaketBundling.findByPk(req.params.id);
//         if (!paket) return res.status(404).send('Paket not found.');

//         await paket.update({ Nama_paket, Deskripsi, Gambar, Harga });
//         res.redirect('/admin/dashboard');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error updating paket bundling.');
//     }
// };

// // Menghapus paket
// exports.deletePaket = async (req, res) => {
//     try {
//         const paket = await PaketBundling.findByPk(req.params.id);
//         if (!paket) return res.status(404).send('Paket not found.');

//         await paket.destroy();
//         res.redirect('/admin/dashboard');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error deleting paket bundling.');
//     }
// };

// exports.getAllTransaksi = async (req, res) => {
//     try {
//         // Fetch all transactions from the database
//         const transaksi = await Transaksi.findAll(); // Ensure you have a `Transaksi` model
//         res.render('admin/transaksi', { transaksi });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error fetching transactions.');
//     }
// };

// exports.deleteTransaksi = async (req, res) => {
//     try {
//         const transaksi = await Transaksi.findByPk(req.params.id);
//         if (!transaksi) return res.status(404).send('Transaction not found.');

//         await transaksi.destroy();
//         res.redirect('/admin/transaksi');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error deleting transaction.');
//     }
// };