const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
// const sequelize = require('sequelize')

const restaurantController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
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
    return await Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant
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
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  // 直接去資料庫做好排序的寫法會過不了測試，因為測試是連到模擬資料庫，無法在撈資料那段以sql調用favorite model
  // getTopRestaurants: (req, res, next) => {
  //   return Restaurant.findAll({
  //     attributes: {
  //       include: [[
  //         // 引用原生mySQL語法記得外面要包一層Array，後面放上該屬性的名稱
  //         sequelize.literal('(SELECT COUNT(*) FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id)'),
  //         'FavoriteCnt'
  //       ]]
  //     },
  //     limit: 10,
  //     order: [['FavoriteCnt', 'DESC']]
  //   })
  //     .then(restaurants => {
  //       if (!restaurants) throw new Error("Restaurant didn't exist!")
  //       const result = restaurants
  //         .map(r => (
  //           {
  //             favoritedCount: r.dataValues.FavoriteCnt,
  //             ...r.toJSON(),
  //             description: r.description.substring(0, 50),
  //             isFavorited:
  //               req.user &&
  //               req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
  //           }
  //         ))
  //       res.render('top-restaurants', { restaurants: result })
  //     })
  //     .catch(err => next(err))
  // }
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        if (!restaurants) throw new Error("Restaurant didn't exist!")

        const result = restaurants
          .map(r => ({
            ...r.toJSON(),
            favoritedCount: r.FavoritedUsers.length,
            isFavorited:
              req.user &&
              req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
