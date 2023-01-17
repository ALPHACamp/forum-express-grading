const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // 圖片上傳到temp folder, dest為目的地

// notice 圖片在傳送是屬於碎片式的，因此有可能多項原因使得傳輸中斷造成檔案不完整，因此先存到一個暫存夾後，複製完整的一份在送到upload

module.exports = upload;
