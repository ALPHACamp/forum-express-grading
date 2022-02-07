// 引入model
const { Restaurant, Category } = require('../models')

const restaurantController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    // 尋找全部restaurant資料，並關連category
    Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurants => {
        // 新增變數data，取得map回傳陣列
        const data = restaurants.map(r => ({
          ...r, // 展開r的物件
          description: r.description.substring(0, 50) // 將餐廳描述截為50字
        }))
        // 渲染restaurants
        return res.render('restaurants', { restaurants: data })
      })
  }
}

// 匯出模組
module.exports = restaurantController
