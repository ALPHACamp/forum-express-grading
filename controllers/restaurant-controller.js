const { Restaurant, Category, User, Comment } = require('../models')
const { RestaurantError } = require('../errors/errors')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const DEFAULT_DISCRIPTION_LENGTH = 50
    const DEFAULT_FIRST_PAGE = 1
    try {
      /** 被soft delete的東西長下面這樣 還是會有category
      Category: {
          id: null,
          name: null,
          deletedAt: null,
          createdAt: null,
          updatedAt: null
        }
      */
      const page = parseInt(req.query.page) || DEFAULT_FIRST_PAGE
      const limit = parseInt(req.query.limit) || DEFAULT_LIMIT // 預留以後可以自己設定一頁要呈現多少餐廳
      const offset = getOffset(limit, page)

      const categoryId = parseInt(req.query.categoryId)
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({ // restaurants.raws代表依照limit和其他條件撈出來的數量，restaurants.count代表除limit以外的條件撈出來有多少個
          raw: true,
          nest: true,
          offset, // 預計跳過幾筆才開始
          limit, // 只撈出特定比數
          where: { // where 就是SQL查詢的條件where, 空的就是全查
            ...categoryId ? { categoryId } : {} // 如果a = 3, {a} 就是 {'a':a}也就是 {a: 3}然後用...展開給where
          },
          /* 範例
          > a = 3
            3
          > b = {...a?{a}:{}}
            { a: 3 }
          */
          include: [Category]
        }),
        Category.findAll({ raw: true })
      ])

      const data = restaurants.rows.map(restaurant => {
        return {
          ...restaurant, // 把restaurant展開後塞進新的object
          description: restaurant.description.substring(0, DEFAULT_DISCRIPTION_LENGTH)
        }
      })

      return res.render('restaurants', {
        route: req.path,
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
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [
          Category,
          {
            model: Comment,
            include: User
          }
        ],
        order: [
          [{ model: Comment }, 'createdAt', 'DESC']
        ]
      })
      if (!restaurant) {
        throw new RestaurantError('Restaurant did not exist!')
      }

      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const id = req.params.id
      const [restaurant, commentAmount] = await Promise.all([Restaurant.findByPk(id, {
        nest: true,
        include: [Category]
      }),
      Comment.count({
        where: { restaurantId: id }
      })
      ])
      if (!restaurant) {
        throw new RestaurantError('Restaurant did not exist!')
      }
      return res.render('dashboard', { restaurant: restaurant.toJSON(), commentAmount })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restController
