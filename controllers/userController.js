const bcrypt = require('bcrypt');
const User = require('../models/Users');
const PaketBundling = require('../models/PaketBundling');

// Register user
// Register user
exports.register = async(req, res) => {
    const { username, password, nama, email, alamat, no_telp } = req.body;

    try {
        // Validasi input
        if (!username || !password || !nama || !email || !alamat || !no_telp) {
            return res.status(400).send('Please fill in all fields.');
        }

        // Cek apakah username sudah ada
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send('Username is already taken.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru
        const newUser = await User.create({
            username,
            password: hashedPassword,
            nama,
            email,
            alamat,
            no_telp,
            role: 'user' // Default role adalah 'user'
        });

        // Redirect ke halaman login setelah registrasi berhasil
        res.redirect('/user/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Login user
exports.login = async(req, res) => {
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

// // Show user dashboard
// exports.showDashboard = (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/user/login'); // Redirect to login if not authenticated
//     }

//     res.render('user/dashboard', { user: req.session.user });
// };



// Contoh controller showDashboard
// exports.showDashboard = async (req, res) => {
//     try {
//       // Ambil data paket dari database
//       const paket = await PaketBundling.findAll();

//       // Kirim data paket ke view dashboard
//       res.render('user/dashboard', { paket });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error fetching data.');
//     }
// };

// Controller untuk menampilkan dashboard
exports.showDashboard = async(req, res) => {
    try {
        // Pastikan user ada di session
        if (!req.session.user) {
            return res.redirect('/user/login'); // Jika tidak ada session user, arahkan ke halaman login
        }

        // Ambil data paket dari database
        const paket = await PaketBundling.findAll();

        // Kirim data paket dan user ke view dashboard
        res.render('user/dashboard', {
            user: req.session.user, // Kirim data user yang ada di session
            paket
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data.');
    }
};