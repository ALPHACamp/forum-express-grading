const { Restaurant, Category, Comment, User } = require('../models')
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
      })
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
        // nest: true // TODO: 這行的意義再研究
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('view_counts')
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
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
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
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
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const result = restaurants.map(restaurant => ({
          ...restaurant.toJSON(),
          description: restaurant.description.substring(0, 50),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fRes => fRes.id === restaurant.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
