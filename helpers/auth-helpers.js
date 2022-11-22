const getUser = (req) => {
  return req.user || null;
}; // 這裡面其實就是把 req.user 再包裝成一支 getUser 函式並導出。這麼做可以讓程式的權責更分離

const ensureAuthenticated = (req) => {
  return req.isAuthenticated();
};

module.exports = {
  getUser,
  ensureAuthenticated,
};
