const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const transaksiRouter = require('./routes/transaksi');
const sequelize = require('./config/database');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const paketRouter = require('./routes/paket');

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
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/paket', paketRouter); // Hanya perlu dipanggil sekali

// Tambahkan routes untuk transaksi
app.use('/', transaksiRouter);

// Landing page route
app.get('/', (req, res) => {
    res.render('landing');  // Render the landing page
});

// Database Sync and Start Server
sequelize.sync()
  .then(() => { 
    console.log('Database connected!');
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  })
  .catch(err => console.error('Database connection failed:', err));
