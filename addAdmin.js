const bcrypt = require('bcrypt');
const User = require('./models/Users');  // Pastikan path ke model sudah benar
const sequelize = require('./config/database');  // Pastikan path ke sequelize sudah benar

// Fungsi untuk membuat admin pertama
const createAdmin = async () => {
  const username = 'admin';  // Username untuk admin pertama
  const password = 'admin123';  // Password untuk admin pertama
  const role = 'admin';  // Role untuk admin pertama
  
  try {
    // Cek apakah admin sudah ada
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('Admin already exists');
      return;  // Jika admin sudah ada, keluar dari fungsi
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat admin baru
    const newAdmin = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    console.log('Admin berhasil dibuat:', newAdmin);
  } catch (err) {
    console.error('Error creating admin:', err.message);
  }
};

// Sync database dan buat admin pertama
sequelize.sync()
  .then(() => {
    console.log('Database connected!');
    createAdmin();  // Panggil fungsi createAdmin untuk membuat admin pertama
  })
  .catch(err => console.error('Database connection failed:', err));
