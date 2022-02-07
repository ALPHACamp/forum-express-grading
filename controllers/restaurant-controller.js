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
  },

  // 瀏覽特定餐廳詳細資訊
  getRestaurant: (req, res, next) => {
    // 查詢動態id的restaurant資料，並關連category
    Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        // 若查詢不到資料，回傳錯誤訊息
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        // 更新資料庫viewCounts值 + 1
        restaurant.update({ viewCounts: restaurant.viewCounts + 1 })

        // 渲染restaurant頁面，將參數轉換成普通物件並帶入
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  // 瀏覽特定餐廳的點擊次數
  getDashboard: (req, res, next) => {
    // 查詢動態路由的restaurant資料，並關聯category
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        // 若查詢不到資料，回傳錯誤訊息
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        // 渲染dashboard頁面，並帶入參數
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = restaurantController
