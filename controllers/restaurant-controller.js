const { Restaurant, Category, Comment, User } = require('../models') // 修改這裡
const { getOffset, getPagination } = require('../helpers/pagination-helper') // 加入這行

const restaurantController = {
  getRestaurants: (req, res,next) => {
    const DEFAULT_LIMIT = 9 // 加入這行
    const categoryId = parseInt(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    // 新增以下
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page) // 增加這裡

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {  // 新增查詢條件
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
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id) 
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // 修改這裡，把 pagination 資料傳回樣板
        })
      })
      .catch(err => next(err)) // 補上
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' } ]
      
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })       
      })
      .then(restaurant =>{
         const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id) 
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited  })})
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      raw: true,
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return res.render('dashboard', { restaurant: restaurant })
      })
      .catch(err => next(err))
  }, // 補逗點，新增以下
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
  }
}

module.exports = restaurantController