const { Restaurant, Category, Comment, User, Favorite, Sequelize } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper') // 加入這行
const favorite = require('../models/favorite')
const restaurant = require('../models/restaurant')

const restaurantController = {
  getRestaurants: (req, res, next) => { // 補上 next
    // 修改以下
    const DEFAULT_LIMIT = 9 // 加入這行
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    // 新增以下
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page) // 增加這裡
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        limit, // 增加這裡
        offset, // 增加這裡
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id) // 新增這一行
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lk => lk.id) // 新增這一行
        const data = restaurants.rows.map(r => ({ // 修改這裡，加上 .rows
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id), // 修改這一行
          isLiked: likedRestaurantsId.includes(r.id) // 修改這一行
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId, // 新增這裡
          pagination: getPagination(limit, page, restaurants.count) // 修改這裡，把 pagination 資料傳回樣板
        })
      })
      .catch(err => next(err)) // 補上
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
  //   Favorite.findAll({
  //     attributes: [
  //       'restaurant',
  //       [Sequelize.literal('COUNT(DISTINCT(restaurantId))'),
  //         'favoritedCount'],
  //       [Sequelize.literal(userID === req.user.id), 'isFavorited']],
  //     group: 'restaurantId',
  //     order: ['favoritedCount', 'DESC'],
  //     limit: 10
  //   }).then(async favorites => {
  //     const result = await Promise.all(favorites.map(async favorite => {
  //       const restaurant = await Restaurant.findByPk(favorite.restaurantId)
  //       return {
  //         ...restaurant.toJSON(),
  //         favoritedCount: favorite.favoritedCount,
  //         isFavorited: favorite.isFavorited
  //       }
  //     }))
  //     res.render('top-restaurants', { restaurants: result })
  //   })

  //     .catch(err => next(err))
  // }

  // getTopRestaurants: (req, res, next) => {
  //   return Favorite.findAll({
  //     attributes: [
  //       'restaurant_id',
  //       [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('restaurant_id'))), 'favoritedCount'],
  //       [Sequelize.literal(`CASE WHEN user_id = ${req.user.id} THEN 1 ELSE 0 END`), 'isFavorited']
  //     ],
  //     group: 'restaurant_id',
  //     order: [
  //       ['favoritedCount', 'DESC']
  //     ],
  //     limit: 10,
  //     raw: true // 設定 raw: true 以獲取原始查詢結果
  //   })
  //     .then(async favorites => {
  //       const restaurantIds = favorites.map(favorite => favorite.restaurant_id)
  //       const restaurants = await Restaurant.findAll({
  //         where: { id: restaurantIds }
  //         // 可選擇要包含的屬性，例如：attributes: ['id', 'name', '...']
  //       })

  //       const result = favorites.map(favorite => {
  //         const restaurant = restaurants.find(r => r.id === favorite.restaurant_id)
  //         return {
  //           ...restaurant.toJSON(),
  //           favoritedCount: favorite.favoritedCount,
  //           isFavorited: favorite.isFavorited
  //         }
  //       })

  //       res.render('top-restaurants', { restaurants: result })
  //     })
  //     .catch(err => next(err))
  // }

  // getTopRestaurants: (req, res, next) => {
  //   Favorite.findAll({
  //     attributes: [
  //       'restaurantId',
  //       [Sequelize.literal('COUNT(DISTINCT(restaurantId))'), 'favoritedCount'],
  //       [Sequelize.literal(`userId = ${req.user.id}`), 'isFavorited']
  //     ],
  //     group: 'restaurantId',
  //     order: [
  //       [Sequelize.literal('favoritedCount'), 'DESC']
  //     ],
  //     limit: 10
  //   }).then(async favorites => {
  //     const result = await Promise.all(
  //       favorites.map(async favorite => {
  //         const restaurant = await Restaurant.findByPk(favorite.restaurantId)
  //         return {
  //           ...restaurant.toJSON(),
  //           favoritedCount: favorite.favoritedCount,
  //           isFavorited: favorite.isFavorited
  //         }
  //       })
  //     )
  //     res.render('top-restaurants', { restaurants: result })
  //   })
  //     .catch(err => next(err))
  // }
}
module.exports = restaurantController
