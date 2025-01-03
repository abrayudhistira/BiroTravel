const bcrypt = require('bcrypt');
const User = require('../models/Users');
const session = require('express-session');

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
