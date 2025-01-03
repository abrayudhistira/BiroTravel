function verifyAdmin(req, res, next) {
    // Pastikan ada token yang diterima di cookies
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(403).send('Access denied, please login');
    }
  
    try {
      const decoded = jwt.verify(token, secretKey); // Verifikasi token menggunakan secret key
      if (decoded.role !== 'admin') {
        return res.status(403).send('Access denied, admin role required');
      }
      req.user = decoded; // Menyimpan informasi user yang sudah didecode
      next(); // Lanjutkan ke rute berikutnya
    } catch (err) {
      return res.status(401).send('Invalid or expired token');
    }
  }
  
  module.exports = verifyAdmin;
  