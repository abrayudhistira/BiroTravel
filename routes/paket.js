const express = require('express');
const { 
  getAllPaket, 
  showAddForm, 
  addPaket, 
  showEditForm, 
  editPaket, 
  deletePaket 
} = require('../controllers/paketBundlingController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); 
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Routes untuk user biasa (melihat paket bundling)
router.get('/', authenticate, getAllPaket); // Menampilkan paket untuk user biasa

// Routes untuk admin (melihat semua paket bundling dan CRUD)
router.get('/admin/paket', authenticate, isAdmin, getAllPaket); // Menampilkan paket untuk admin
router.get('/admin/paket/new', authenticate, isAdmin, showAddForm); // Form tambah paket baru
router.post('/admin/paket', authenticate, isAdmin, upload.single('Gambar'), addPaket); // Menambah paket baru
router.get('/admin/paket/edit/:id', authenticate, isAdmin, showEditForm); // Form edit paket
router.post('/admin/paket/edit/:id', authenticate, isAdmin, upload.single('Gambar'), editPaket); // Mengedit paket
router.post('/admin/paket/delete/:id', authenticate, isAdmin, deletePaket); // Menghapus paket

module.exports = router;
