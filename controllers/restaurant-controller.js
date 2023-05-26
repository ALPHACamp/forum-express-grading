const { Restaurant, Category } = require('../models') // 帶入資料庫
const restaurantController = {
  getRestaurants: (req, res, next) => {
    // 首頁
    const categoryId = Number(req.query.categoryId) || '' // 抓出網址的id並字串轉數字
    return Promise.all([
      Restaurant.findAll({
        include: Category, // 帶入關聯
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值，不是空值就帶入與網址相同的id並展開，是的話帶入{}空字串，才能使用hbs的#ifCond
        },
        nest: true, // include整理
        raw: true
      }),
      Category.findAll({ raw: true }) // 抓Category資訊
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r, // 把 r 展開倒入 data 以便做資料修改
          description: r.description.substring(0, 50) // 修改description，擷取 0-50 的文字內容
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  // 詳情頁
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category // 拿出關聯的 Category model
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        // 將瀏覽次數更新後的餐廳資料傳遞給模板引擎進行渲染
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  // 詳情頁儀表板
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
  }
}
module.exports = restaurantController
