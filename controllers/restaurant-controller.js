const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    const DEFAULT_LIMIT = 9
    // 保留 req.query.limit ，可以新增功能：選擇一頁要顯示幾筆資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        where: {
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        include: Category,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        //! req.user. -> 從反序列化取得
        const favoritedRestaurantsId = req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user.LikedRestaurants.map(lr => lr.id)

        const data = restaurants.rows.map(r => ({
          ...r,
          // 當 key 重複時，後面出現的會取代前面的
          description: r.description.substring(0, 50), // description 擷取前 50 個字元
          isFavorited: req.user && favoritedRestaurantsId.includes(r.id), // return true or false
          isLiked: req.user && likedRestaurantsId.includes(r.id) // return true or false
        }))

        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        { model: Category }, //! 取得 restaurant.Category
        { model: Comment, include: [{ model: User }] }, //! 取得 restaurant.Comments 、 restaurant.Comments[].User
        // -簡寫
        // Category,
        // { model: Comment, include: User }
        { model: User, as: 'FavoritedUsers' }, //! 取得 restaurant.FavoritedUsers[] (一個 array，包含所有將此餐廳加到最愛的 user)
        { model: User, as: 'LikedUsers' } //! 取得 restaurant.LikedUsers[] (一個 array)
      ],

      order: [ //* 排序：讓最近的 comment 排在最上面
        [{ model: Comment }, 'createdAt', 'DESC'] // 以關聯的 model 排序才需要 { model:  }
      ]
    })
      .then(async restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        await restaurant.increment('viewCounts') // 將 viewCounts 加一(預設)

        const isFavorited = restaurant.FavoritedUsers.some(fu => fu.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(lu => lu.id === req.user.id)

        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // nest: true, raw: true 會把一對多的關係破壞(多對一不會)
      include: [Category, Comment]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },

  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        const result = restaurants.map(restaurant => ({
          ...restaurant.toJSON(),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === restaurant.id)
          // 同上：isFavorited: restaurant.FavoritedUsers.some(fu => fu.id === req.user.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
