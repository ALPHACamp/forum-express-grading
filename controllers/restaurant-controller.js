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

      // FavoritedRestaurants 本身是一個array，放此user所有喜歡的餐廳
      // req.user && 是要先確認確實有登入帳戶，不然後半部可能會出錯
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const data = restaurants.rows.map(restaurant => {
        return {
          ...restaurant, // 把restaurant展開後塞進新的object
          description: restaurant.description.substring(0, DEFAULT_DISCRIPTION_LENGTH),
          isFavorited: favoritedRestaurantsId.includes(restaurant.id), // 如果restaurant在 id list中回傳true
          isLiked: likedRestaurantsId.includes(restaurant.id) // 如果restaurant在 id list中回傳true
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
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' }, // 取出喜歡這間餐廳的user，如果登入user在其中，這個restaurant單一頁面就會出現isFavorited
          { model: User, as: 'LikedUsers' } // 取出like這間餐廳的user
        ],
        order: [
          [{ model: Comment }, 'createdAt', 'DESC'] // 第1欄位是放置associate的，如果是自己的欄位不用加
        ]
      })
      if (!restaurant) {
        throw new RestaurantError('Restaurant did not exist!')
      }

      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant',
        {
          restaurant: restaurant.toJSON(),
          isFavorited: restaurant.FavoritedUsers.some(user => user.id === req.user.id), // some尋找array終至少有一個值符合條件
          isLiked: restaurant.LikedUsers.some(user => user.id === req.user.id)
        })
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
  },
  getFeeds: async (req, res, next) => {
    try {
      // 找出餐廳與評論最近10筆成現在feed
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          include: [Category],
          limit: 10,
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          include: [User, Restaurant],
          limit: 10,
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        })
      ])
      return res.render('feeds', { restaurants, comments })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restController
