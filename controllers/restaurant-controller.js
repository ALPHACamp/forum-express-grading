const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      // 設定預設limit
      const DEFAULT_LIMIT = 9

      // 從網址上拿下來的參數是字串，先轉成 Number 再操作
      const categoryId = Number(req.query.categoryId) || ''
      // 取得page
      const page = Number(req.query.page) || 1
      // req.query.limit 預留資料限制數量:每頁顯示 N 筆
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: { // 查詢條件
            ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
          },
          limit,
          offset,
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])

      const data = restaurants.rows.map(r => {
        r.description = r.description.substring(0, 50)
        return r
      })

      // const data2 = restaurants.map(r => ({
      //   ...r,
      //   description: r.description.substring(0, 50)
      // }))

      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          {
            model: Comment,
            include: User
          }
        ],
        order: [[Comment, 'id', 'DESC']]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const incrementResult = await restaurant.increment('viewCounts')

      res.render('restaurant', { restaurant: incrementResult.toJSON() })
    } catch (err) { next(err) }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, { model: Comment }]
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) { next(err) }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [Category],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant],
          raw: true,
          nest: true
        })
      ])

      res.render('feeds', {
        restaurants,
        comments
      })
    } catch (err) { next(err) }
  }
}
module.exports = restaurantController
