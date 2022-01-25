// 引入model
const { Restaurant } = require('../models')

const adminController = {
  // 瀏覽後台網頁
  getRestaurants: (req, res, next) => {
    // 查詢Restaurant所有資料
    Restaurant.findAll({
      // 去除sequelize物件實例
      raw: true
    })
      // 渲染admin/restaurants畫面
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = adminController
