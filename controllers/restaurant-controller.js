// restaurantController 物件裡面有 getRestaurants 方法
const { Restaurant, Category, User, Comment, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 按其他類別 || 沒有按給預設（全部）
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 這邊預留未來可能讓使用者決定要顯示的筆數
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({ // [{}, {}...]
        include: 'Category',
        where: {
          ...(categoryId ? { categoryId } : {})
        }, // categoryId 有值 { categoryId } + ... -> categoryId，沒有值就忽略不查詢
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true }) // 這邊就不用 nest
    ])
      .then(([restaurants, categories]) => { // 做縮字整理至 50 字
        const favoriteRestaurantsIdList = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsIdList = req.user && req.user.LikedRestaurants.map(like => like.id)
        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, 50), // 沒有寫 restaurant 會出 description 還沒定義的錯誤
            isFavorited: favoriteRestaurantsIdList.includes(restaurant.id),
            isLiked: likedRestaurantsIdList.includes(restaurant.id)
            // {} 裡新增 isFavorited key
            // === map( => ({...回傳到陣列的值}))
            // [].includes(...) 振列裡面包含撈出來的餐廳 id 就給 T 否則 F 到 restaurants.hbs
          }
        })
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // restaurants.count === 資料總筆數
        })
      }).catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: [ // Category 併入 Restaurant
        Category,
        { model: Comment, include: User } // 取得關聯資料表 Comment 將 User 併入
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        restaurant.increment('view_count', { by: 1 }) // 這邊要注意，不需要 nest
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      }).catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { include: 'Category', raw: true, nest: true, attributes: ['id', 'name', 'view_count'] }) // 為何??
      .then(restaurant => {
        res.render('dashboard', { restaurant })
      })
      .catch(error => next(error))
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
    ]).then(([restaurants, comments]) => {
      res.render('feeds', {
        restaurants,
        comments
      })
    }).catch(error => next(error))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{
        model: User, as: 'FavoritedUsers'
      }]
    })
      .then(restaurants => {
        const result = restaurants.map(rest => ({
          ...rest.toJSON(),
          description: rest.dataValues.description.substring(0, 50),
          favoritedCount: rest.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(r => r.id === rest.id) // some 有一個符合就是 true
        })).sort((a, b) => b.favoritedCount - a.favoritedCount)
        res.render('top-restaurants', { restaurants: result.slice(0, 10) })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController // 匯出才能在其他檔案中使用
