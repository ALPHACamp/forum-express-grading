const getUser = req => {
  // console.log("getUser", req.user); 登入前為undefined。登入後例子如下
  // getUser {
  // id: 1,
  // name: 'root',
  // email: 'root@example.com',
  // password: '$2a$10***',
  // isAdmin: true,
  // image: 'https://i.imgur.com/d07pwY9.jpeg',
  // createdAt: 2022-12-01T08:22:54.000Z,
  // updatedAt: 2022-12-01T12:09:59.000Z
  // }
  return req.user || null
} // 這裡面其實就是把 req.user 再包裝成一支 getUser 函式並導出。這麼做可以讓程式的權責更分離 (app.js)

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}
