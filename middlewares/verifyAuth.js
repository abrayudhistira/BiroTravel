function verifyAuth(req, res, next) {
    // Cek apakah pengguna sudah login dengan memeriksa session
    if (!req.session.user) {
      return res.status(403).send('Access denied, please login');
    }
  
    // Menyimpan data user dari session ke dalam request untuk digunakan di rute berikutnya
    req.user = req.session.user;
  
    // Lanjutkan ke rute berikutnya
    next();
  }
  
  module.exports = verifyAuth;
  