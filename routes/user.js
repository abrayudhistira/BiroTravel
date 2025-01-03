const express = require('express');
const { 
    showLogin, 
    showRegister, 
    showDashboard, 
    login, 
    register 
} = require('../controllers/userController');
const router = express.Router();

// Route to show login page
router.get('/login', showLogin);  
// Route to handle login
router.post('/login', login);     

// Route to show register page
router.get('/register', showRegister);  
// Route to handle user registration
router.post('/register', register);

// Route to show user dashboard (only for logged-in users)
router.get('/dashboard', showDashboard);

// Route to logout (destroy session)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => { 
        if (err) {
            return res.status(500).send('Error during logout.');
        }
        res.redirect('/user/login');
    });
});

module.exports = router;
