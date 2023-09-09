const { Restaurant, Category, Comment, User, Favorite } = require('../../models')
const restaurantServices = require('../../services/restaurant-services') // 引入 restaurant-services
const favorite = require('../../models/favorite')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      // 修改以下,當項目變多時，需要改成用陣列
      include: [
        Category, // 拿出關聯的 Category model
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' }, // 新增這行
        { model: User, as: 'LikedUsers' } // 新增這行
      ]
      // 1.移除raw: true， nest: true，因查到的資料後面還要用sql的function
      // 2.移除raw: true， nest: true，因comment會破壞一對多的關係
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id) // 新增這一行
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id) // 新增這一行
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited, // 新增這一行
          isLiked // 新增這一行
        }) // 讓回去的資料變成JSON的格式
      })
      .catch(err => next(err))
  },
  // 新增一個新的 function 叫做  getDashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      // 去資料庫用 id 找一筆資料
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  // 新增一個新的 function 叫做  getFeeds
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
      include: [{ model: User, as: 'FavoritedUsers' }],
      limit: 10
    })
      .then(restaurants => {
        const result = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedRestaurants.map(fr => fr.id).includes(restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
  // getTopRestaurants: (req, res, next) => {
  //   return Promise.all([
  //     Favorite.findAll({
  //       attributes: [
  //         'restaurantId',
  //         [Sequelize.literal('COUNT(DISTINCT(restaurantId))'), 'favoritedCount'],
  //         [Sequelize.literal(userId == req.user.id), 'isFavorited']
  //       ],
  //       group: 'restaurantId',
  //       order: [
  //         ['favoritedCount', 'DESC']
  //       ],
  //       limit: 10
  //     })
  //   ])
  //     .then(async favorites => {
  //       const result = await Promise.all(
  //         favorites.map(async favorite => {
  //           const restaurant = await Restaurant.findByPk(favorite.restaurantId)
  //           return {
  //             ...restaurant.toJSON(),
  //             favoritedCount: favorite.favoritedCount,
  //             isFavorited: favorite.isFavorited
  //           }
  //         })
  //       )
  //       res.render('top-restaurants', { restaurants: result })
  //     })

  //     .catch(err => next(err))
  // }

}
module.exports = restaurantController
