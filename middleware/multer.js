const multer = require("multer");
const upload = multer({ dest: "temp/" }); //用參數設定使用者上傳的圖片會暫存到 temp 這個臨時資料夾中。
module.exports = upload; //把這個方法存成 upload 後導出
