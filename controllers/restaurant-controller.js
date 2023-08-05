const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作

      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: { // 新增查詢條件
            ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值,... 有列後性，判斷完才會展開
          },
          limit, // 每頁限制放的資料量
          offset, // 每次開始計算新的一頁時，先偏移多少資料
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      // 因為 req.user 有可能是空的，先做檢查所以多加了 req.user &&
      const favoritedRestaurantsId = await req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurantsId = await req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id),
        isLiked: likedRestaurantsId.includes(r.id)
      }))
      res.render('restaurants', {
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
        order: [
          [Comment, 'createdAt', 'DESC']
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      // 用 restaurant 關聯的 FavoritedUsers 裡的 User id 是否與 req.user.id相符
      const isFavorited = await restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = await restaurant.LikedUsers.some(l => l.id === req.user.id)
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, Comment]
        // nest,raw會衝到 include 的Category, Comment
        // nest: true,
        // raw: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
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
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [
          { model: User, as: 'FavoritedUsers' }
        ]
      })
      if (!restaurants) throw new Error("Restaurant didn't exist!")
      const restaurantsTop10 = await restaurants
        .map(r => ({
          ...r.toJSON(),
          description: r.description.substring(0, 50),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)
      res.render('top-restaurants', { restaurants: restaurantsTop10 })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = restaurantController
