const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
//const transaksiRouter = require('./routes/adminTransaksi');
const sequelize = require('./config/database');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const paketRouter = require('./routes/paket');
const PaketBundling = require('./models/PaketBundling');
const adminTransaksiRouter = require('./routes/adminTransaksi'); // Admin-specific transaksi routes
const userTransaksiRouter = require('./routes/userTransaksi'); // User-specific transaksi routes

// Inisialisasi app terlebih dahulu
const app = express();

// Gunakan middleware setelah inisialisasi app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware untuk static file upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add session middleware here
app.use(session({
    secret: 'your-secret-key', // You can use a better secret here
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (Public resources)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/user', userRouter); // User routes
app.use('/admin', adminRouter); // Admin routes (login, dashboard, logout)
app.use('/admin', paketRouter); // Paket Bundling routes (CRUD operations)
app.use('/admin/transaksi', adminTransaksiRouter); // Admin-specific transaksi routes
app.use('/', userTransaksiRouter); // User-specific transaksi routes

// Tambahkan routes untuk transaksi
//app.use('/', transaksiRouter);

// Landing page route
app.get('/', async(req, res) => {
    try {
        // Ambil daftar paket bundling dari database
        const paket = await PaketBundling.findAll();

        // Render halaman landing dengan data paket
        res.render('landing', { paket });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching paket data');
    }
})

// Database Sync and Start Server
sequelize.sync()
    .then(() => {
        console.log('Database connected!');
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch(err => console.error('Database connection failed:', err));