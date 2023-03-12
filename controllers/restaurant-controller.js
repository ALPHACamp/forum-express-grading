const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurant = require('../models/restaurant')
const restaurantController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category, // 運用 include 一併拿出關聯的 Category model
        where: {
          ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
    .then(([restaurants, categories]) => {
      //console.log(restaurants)
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const LikedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id),
        /** 
         * 取出使用者的收藏清單，然後map成id清單，之後用Array的includes方法進行比對，最後會回傳布林值。
         * 不過因為req.user可能是空的，謹慎起見我們要寫成 req.user && req.user.FavoritedRestaurants... 先做檢查。
         * 整段程式碼的意思就是說要來看看現在這間餐廳是不是有被使用者收藏，有的話 isFavorited 就會是 true，否則會是 false。
         **/
        isLiked: LikedRestaurantsId.includes(r.id)
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
      ] // 拿出關聯的 Category model
      // nest: true,
      // raw: true
    })
      .then(restaurant => {
        //console.log(restaurant.Comments[0].dataValues)
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCount')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        /**
         * 這裡我們是使用 some 方法來操作陣列。使用 some 的好處是只要帶迭代過程中找到一個符合條件的項目後，就會立刻回傳 true，後面的項目不會繼續執行。
         * 比起 map 方法無論如何都會從頭到尾把陣列裡的項目執行一次，some 因為加入了判斷條件 f.id === req.user.id，可以有效減少執行次數。
         **/
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
      // nest: true,
      // raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant: restaurant.toJSON()
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
  }
}
module.exports = restaurantController