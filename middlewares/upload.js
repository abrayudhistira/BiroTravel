const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Menyimpan sementara di folder 'uploads'
module.exports = upload;
