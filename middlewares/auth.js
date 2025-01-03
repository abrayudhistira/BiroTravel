const authenticate = (req, res, next) => {
    // Cek apakah pengguna sudah login dengan memeriksa session
    if (!req.session.user) {
      return res.status(403).redirect('/user/login'); // Redirect ke halaman login jika belum login
    }
  
    // Simpan data user ke request untuk akses di route selanjutnya
    req.user = req.session.user;
    next();
  };
  
  const isAdmin = (req, res, next) => {
    // Pastikan hanya admin yang bisa mengakses route ini
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).send('Access denied.'); // Menolak akses jika bukan admin
    }
    next();
  };
  
module.exports = { authenticate, isAdmin };
  