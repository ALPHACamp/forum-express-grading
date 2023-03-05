// - 處理屬於前台restaurant路由的相關請求
const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const FIRST_PAGE = 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const page = Number(req.query.page) || FIRST_PAGE
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || ''
    try {
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          where: {
            ...(categoryId ? { categoryId } : {}) // -進行判斷後再展開
          },
          limit,
          offset,
          include: [Category]
        }),
        Category.findAll({ raw: true })
      ])
      // - 對原有description進行字數刪減
      const MAX_OF_DESCRIPTION_LENGTH = 50
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, MAX_OF_DESCRIPTION_LENGTH)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [
          { model: Category },
          {
            model: Comment, // -餐廳對評論為1對多，會以複數型命名屬性並以 Array 包裝資料
            include: [{ model: User }]
          }
        ],
        order: [
          [Comment, 'created_at', 'DESC']
        ]
      })
      if (!restaurant) throw new Error('此餐廳不存在!')
      // - 若餐廳存在增加瀏覽次數(累加值若為1可省略第二參數)
      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [
          Category,
          Comment
        ]
      })
      const numOfComments = restaurant.Comments.length
      if (!restaurant) throw new Error('此餐廳不存在!')
      return res.render('dashboard', { restaurant: restaurant.toJSON(), numOfComments })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restaurantController
