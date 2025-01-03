const bcrypt = require('bcrypt');
const User = require('../models/Users');

// Register user
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).send('Please fill in all fields.');
        }

        // Check if username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send('Username is already taken.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        // Redirect to login page after successful registration
        res.redirect('/user/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid username or password.');
        }

        // Store user in session
        req.session.user = user;

        // Redirect to user dashboard
        res.redirect('/user/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Show login page
exports.showLogin = (req, res) => {
    res.render('user/login', { title: 'Login' });
};

// Show register page
exports.showRegister = (req, res) => {
    res.render('user/register', { title: 'Register' });
};

// Show user dashboard
exports.showDashboard = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login'); // Redirect to login if not authenticated
    }

    res.render('user/dashboard', { user: req.session.user });
};
