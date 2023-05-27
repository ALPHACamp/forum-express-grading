const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  // 使用者瀏覽前台所有餐廳
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 分頁預設值
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    // 取得使用者收藏餐廳之id陣列
    const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
    // 取得使用者喜歡餐廳之id陣列
    const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        where: { ...categoryId ? { categoryId } : {} },
        offset,
        limit
      })

      const data = restaurants.rows.map(rest => ({
        ...rest,
        description: rest.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(rest.id), // 比對favoritedRestaurantsId中與rest.id符合的項目
        isLiked: likedRestaurantsId.includes(rest.id)
      }))
      return res.render('restaurants', {
        categoryId,
        categories,
        restaurants: data,
        pagination: getPagination(limit, page, restaurants.count) // restaurants.count 為資料總數
      })
    } catch (e) {
      next(e)
    }
  },
  // 使用者瀏覽單筆餐廳資料
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
      await Restaurant.increment('view_counts', { where: { id } })
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (e) {
      next(e)
    }
  },
  // 使用者查看單筆餐廳Dashboard
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, { include: [Category, { model: Comment }] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const totalComments = restaurant.Comments?.length || 0
      // console.log(totalComments)
      return res.render('dashboard', { restaurant: restaurant.toJSON(), totalComments })
    } catch (e) {
      next(e)
    }
  },
  // 使用者瀏覽最新動態
  getFeeds: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        order: [['createdAt', 'DESC']],
        limit: 10
      })
      const comments = await Comment.findAll({
        raw: true,
        nest: true,
        include: [User, Restaurant],
        order: [['createdAt', 'DESC']],
        limit: 10
      })
      return res.render('feeds', { restaurants, comments })
    } catch (e) {
      next(e)
    }
  },
  // 使用者瀏覽人氣餐廳
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })
      const results = restaurants.map(rest => ({
        ...rest.toJSON(),
        description: rest.description.substring(0, 10),
        favoritedCount: rest.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.some(f => f.id === rest.id)
      })).sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
      // sort: 結果大於1為DESC、小於1為ASC； slice: 取出0~10前的項目
      return res.render('top-restaurants', { restaurants: results })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = restaurantController
