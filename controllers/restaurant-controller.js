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

      // const data = restaurants.rows.map(r => {
      //   r.description = r.description.substring(0, 50)
      //   return r
      // })

      // 檢查req.user是否為false 才回傳favorited資料
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)

      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)

      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id),
        isLiked: likedRestaurantsId.includes(r.id)
      }))

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
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[Comment, 'id', 'DESC']]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const incrementResult = await restaurant.increment('viewCounts')
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)

      res.render('restaurant', {
        restaurant: incrementResult.toJSON(),
        isFavorited,
        isLiked
      })
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
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      }
      )
      const topRestaurants = restaurants.map(r => ({
        ...r.toJSON(),
        description: r.description.substring(0, 50),
        favoritedCount: r.FavoritedUsers.length,
        isFavorited: req.user && req.user.FavoritedRestaurants.some(f => f.id === r.id)
      })).sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)

      res.render('top-restaurants', { restaurants: topRestaurants })
    } catch (err) { next(err) }
  }
}
module.exports = restaurantController
