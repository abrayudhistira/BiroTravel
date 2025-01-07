const express = require('express');
const { 
  getAllPaket,
  updatePaket, 
  deletePaket, 
  showAddForm, 
  showEditForm, 
  addPaket,
  editPaket
} = require('../controllers/paketBundlingController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // Middleware for file uploads

const router = express.Router();

// Routes for users (view packages)
router.get('/', authenticate, getAllPaket); // View packages for regular users

// Routes for admins (CRUD operations)
router.get('/paket', authenticate, isAdmin, getAllPaket); // View packages for admin

router.get('/paket/new', authenticate, isAdmin, showAddForm); // Show form to add a new package
router.post('/paket/new', authenticate, isAdmin, upload.single('Gambar'), addPaket); // Add a new package

router.get('/paket/edit/:id', authenticate, isAdmin, showEditForm); // Show form to edit a package
router.post('/paket/edit/:id', authenticate, isAdmin, upload.single('Gambar'), editPaket); // Edit a package

router.post('/paket/delete/:id', authenticate, isAdmin, deletePaket); // Delete a package

module.exports = router;