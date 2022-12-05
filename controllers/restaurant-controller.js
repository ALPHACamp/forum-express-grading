const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串轉成Number

    const page = Number(req.query.page) || 1 // 來自views的內容或者第1頁
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 來自views的內容或者9筆資料
    const offset = getOffset(limit, page) // 藉由page和limit算出offset

    return Promise.all([
      Restaurant.findAndCountAll({ // 改成findAndCountAll是為了最後要取得restaurants.count
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
        },
        limit, // 對restaurants DB查詢
        offset, // 對restaurants DB查詢 => offset幾筆後，limit顯示幾筆
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        // console.log(req.query) => 從?page=2&categoryId=2獲得{page:2, categoryId:2}
        const data = restaurants.rows.map(r => ({
          ...r, // 展開運算子將每一筆restaurant的資料展開後用data接住，展開後的description會被下方新的description賦值
          description: r.description.substring(0, 50), // 將餐廳文字描述截斷為50字元的長度
          isFavorited: favoritedRestaurantsId.includes(r.id), // 新增一個屬性，在陣列比對過後最後回傳一個布林值，代表是是不是有被收藏
          isLiked: likedRestaurantsId.includes(r.id)
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
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
      // nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
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
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']], // DESC降冪，ASC升冪
        include: Category,
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
