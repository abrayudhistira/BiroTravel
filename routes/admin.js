const express = require('express');
const { showLoginAdmin, loginadmin, showAdminPage, showDashboard, getAllPaket, getPaketById, updatePaket, deletePaket, createPaket } = require('../controllers/adminController');
const router = express.Router();
const { authenticate, isAdmin } = require('../middlewares/auth');
const { logout } = require('../controllers/adminController');
const adminController = require('../controllers/adminController');

// Route to display the login page (GET request)
router.get('/adminlogin', showLoginAdmin); // Show the login page

// Route to handle login form submission (POST request)
router.post('/loginadmin', loginadmin); // Handle login

// Route for the admin dashboard
router.get('/dashboardadmin', showDashboard);

// Route to access admin page
router.get('/admin', showAdminPage);

router.get('/logout', logout);

// // Route to show the form for adding a new package
// router.get('/paket/new', authenticate, isAdmin, (req, res) => {
//     res.render('admin/newPaket', { title: 'Add New Paket' });
// }); // Log out and destroy session



// // CRUD Paket Bundling
// router.get('/paket', authenticate, isAdmin, getAllPaket); // Lihat semua paket
// router.post('/paket/new', authenticate, isAdmin, createPaket); // Tambah paket baru
// router.get('/paket/:id', authenticate, isAdmin, getPaketById); // Lihat detail paket
// router.put('/paket/edit/:id', authenticate, isAdmin, updatePaket); // Edit paket
// router.delete('/paket/delete/:id', authenticate, isAdmin, deletePaket); // Hapus paket

// // Route untuk menampilkan semua transaksi
// router.get('/transaksi', authenticate, isAdmin, adminController.getAllTransaksi);

// // Route untuk menghapus transaksi
// router.delete('/transaksi/:id', authenticate, isAdmin, adminController.deleteTransaksi);

module.exports = router;