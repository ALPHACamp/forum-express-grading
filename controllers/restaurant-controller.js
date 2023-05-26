const { Restaurant, Category } = require('../models') // 帶入資料庫
// 載入 pagination-helper
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // 首頁
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 抓出網址的id並字串轉數字
    const page = Number(req.query.page) || 1 // 把 2 取出來，如果 query string 沒有攜帶特定數字的話就預設為 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 可以讓使用者選擇「每頁顯示 N 筆」的功能
    const offset = getOffset(limit, page) // sequelize 查詢資料庫時多帶入 limit 和 offset 兩個參數

    return Promise.all([
      Restaurant.findAndCountAll({ // 尋找+計算總數並用.rows抓數量
        include: Category, // 帶入關聯
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值，不是空值就帶入與網址相同的id並展開，是的話帶入{}空字串，才能使用hbs的#ifCond
        },
        // 下指令給sequelize
        limit,
        offset,
        nest: true, // include整理
        raw: true // lean()
      }),
      Category.findAll({ raw: true }) // 抓Category資訊
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r, // 把 r 展開倒入 data 以便做資料修改
          description: r.description.substring(0, 50) // 修改description，擷取 0-50 的文字內容
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // pagination 資料傳回樣板
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
