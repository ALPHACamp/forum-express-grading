const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const where = {}
    if (categoryId) where.categoryId = categoryId
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        // where, // 來源: Sequelize的find({where:{categoryId}})
        where: {
          ...categoryId ? { categoryId } : {}
          // 展開運算子順序較低，先進行 categoryId 之三元運算子再展開categoryId結果
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        // 因為 req.user 有可能是空的所以先檢查
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLike: likedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
      // nest: true, //... 有bug會取消一對多關係
      // raw: true //... 整理格式
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        // const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id) //.....太複雜
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLike = restaurant.LikedUsers.some(f => f.id === req.user.id)

        // res.render('restaurant', { restaurant })
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          // isFavorited: favoritedRestaurantsId.includes(r.id) //... 太複雜
          isFavorited,
          isLike
        })
      })
      .catch(err => next(err))
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
      .then(([restaurants, comments]) => res.render('feeds', { restaurants, comments }))
      .catch(err => next(err))
  },
  getDashboard: async (req, res, next) => {
    // getDashBoard 正確執行的話，應呼叫 res.render
    // res.render 的第 1 個參數要是 'dashboard'
    // res.render 的第 2 個參數要包含 restaurant，其 name 屬性的值應是 '銷魂麵'
    // res.render 的第 2 個參數要包含 restaurant，其 viewCounts 值應該是 3
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: { model: User, as: 'FavoritedUsers' }
    })
      .then(restaurants => {
        const result = restaurants.map(restaurant => ({
          ...restaurant.toJSON(),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(res => res.id === restaurant.id)
          // 因為 req.user 有可能是空的所以先檢查
        }))
        result.sort((a, b) => b.favoritedCount - a.favoritedCount)
        const top10 = result.slice(0, 10)
        return res.render('top-restaurants', { restaurants: top10 })
      })
      .catch(err => next(err))
  }
}
module.exports = restController
