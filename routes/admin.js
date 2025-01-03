const express = require('express');
const { showLoginAdmin, loginadmin, showAdminPage, showDashboard } = require('../controllers/adminController');
const router = express.Router();
const { logout } = require('../controllers/adminController');

// Route to display the login page (GET request)
router.get('/adminlogin', showLoginAdmin);  // Show the login page

// Route to handle login form submission (POST request)
router.post('/loginadmin', loginadmin);     // Handle login

// Route for the admin dashboard
router.get('/dashboardadmin', showDashboard); 

// Route to access admin page
router.get('/admin', showAdminPage); 

router.get('/logout', logout);  // Log out and destroy session


module.exports = router;
