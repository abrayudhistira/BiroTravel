const isAdmin = (req, res, next) => {
    // Cek apakah pengguna sudah login melalui session
    if (!req.session.user) {
      return res.status(403).send("Access denied, no user session found.");
    }
  
    // Periksa apakah role pengguna adalah admin
    if (req.session.user.role !== 'admin') {
      return res.status(403).send("Access denied, admin role required.");
    }
  
    // Menyimpan data pengguna dalam objek request (opsional, tergantung kebutuhan aplikasi Anda)
    req.user = req.session.user;
  
    // Lanjutkan ke rute selanjutnya
    next();
  };
  
  module.exports = isAdmin;
  
