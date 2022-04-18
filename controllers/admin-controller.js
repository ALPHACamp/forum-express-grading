const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把 Sequelize 包裝過的一大包物件轉換成格式比較單純的 JS 原生物件，再把資料傳到 view 裡
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止此區塊的程式碼，並在畫面顯示錯誤提示。這是 throw 關鍵字的效果。
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
