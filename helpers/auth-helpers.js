// Thinking 當在app.js使用passport 的req.use時，為了考量到後續可能驗證套件會改變，造成修正的地方過多，因此必須要另外件個檔案進行包裝獨立運作，讓後續套件改變後較為容易維護或修正。
// Thinking helper的檔案變適用於此包裝
const getUser = req => {
  // note the same at req.user ? req.user : null
  return req.user || null;
};

module.exports = {
  getUser
};
