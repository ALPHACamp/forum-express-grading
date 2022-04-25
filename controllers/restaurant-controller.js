const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9 // 代表想要一頁有 9 筆餐廳資料
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串
    const page = Number(req.query.page) || 1 // 如果 query string 沒有攜帶特定數字的話page預設為 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預留加上讓使用者選擇「每頁顯示 N 筆」的功能
    const offset = getOffset(limit, page)
    const where = {}
    if (categoryId) where.categoryId = categoryId
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: where,
        // where: { // 新增查詢條件
        //   ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        // },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('view_counts')
      // await restaurant.reload()
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
    if (!restaurant) throw new Error("Restaurant didn't exist!")
    res.render('dashboard', {
      restaurant
    })
  }
}
module.exports = restaurantController
