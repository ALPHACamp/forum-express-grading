const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({ // 用findAndCountAll去算總共有幾間餐廳，才可以去算pagination的資訊
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        limit, // 加入分頁查詢條件
        offset, // 加入分頁查詢條件
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // 透過 passport 裡的 user 資料，取出被使用者收藏過的餐廳 id，並用 map 產生新的陣列
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        // map 整理出來的新陣列，需要多設一個變數 data 來接住回傳值的資料
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50), // 把敘述截斷為50個字，截取字串可用 substring()
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id) // 加入一個 isLiked 屬性，讓前端可以去做判斷切換Like or Unlike
        }))
        return res.render('restaurants', {
          restaurants: data, // 要使用的資料會放在 data
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        // raw: true,
        nest: true,
        include: [ // 當項目變多時，需要改成用陣列
          Category,
          { model: Comment, include: User }, // 要拿到關聯的 Comment，再拿到 Comment 關聯的 User，要做兩次的查詢
          { model: User, as: 'FavoritedUsers' }, // 透過 Restaurant model 取得 與 User model 的關係為"已收藏這間餐廳的使用者"
          { model: User, as: 'LikedUsers' }
        ]
      })
      .then(restaurant => {
        // console.log(restaurant.Comments[0].dataValues)
        if (!restaurant) throw new Error('這間餐廳不存在!')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(fu => fu.id === req.user.id) // some為執行到true就結束
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
    return Restaurant.findByPk(req.params.id,
      {
        raw: true,
        nest: true,
        include: Category
      })
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!')
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10, // 顯示10筆資料
        order: [['createdAt', 'DESC']], // 用order做排序，第1個參數是指定欄位的名稱，第2個參數是排序方法
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
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        const result = restaurants.map(restaurant => ({
          ...restaurant.toJSON(),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === restaurant.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
