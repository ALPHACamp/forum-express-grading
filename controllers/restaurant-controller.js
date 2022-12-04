// mvc分流裡的controller

const { Restaurant, Category, Comment, User, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 每頁顯示的數量
    // 將categoryId轉成數字或者為空(為全部做準備)
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1 // 頁數預設
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 一頁分幾個預設，req.query還尚未設定。
    const offset = getOffset(limit, page)// 偏移量

    return Promise.all([Restaurant.findAndCountAll({
      include: Category,
      // 當使用者點選的是「全部」這個頁籤時，categoryId 會是空值。設定 where 查詢條件時，撈出全部where: {}
      // categoryId=true=...{categoryId}(展開categoryId)
      where: { ...categoryId ? { categoryId } : {} },
      limit,
      offset,
      nest: true,
      raw: true
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        // 將不需重複的動作取出。req.user是有可能為空，所以要先檢查。取出的fr轉成fr.id再存入。這裡存入的資料為passport從資料庫取出的資料(即登入者關聯的餐廳)
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.likedRestaurants.map(fr => fr.id)
        const data = restaurants.rows.map(r =>
        ({
          ...r,
          description: r.description.substring(0, 50),
          // 新增isFavorite屬性。在這裡比較每間餐廳是否為favorite。
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })// 回傳給hbs是否需要active
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      // 關聯user model，並叫出關聯關係(AS)
      include: [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'likedUsers' }],
      order: [[Comment, 'createdAt', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('view_counts')
      })
      .then(restaurant => {
        // some:只要帶迭代過程中找到一個符合條件的項目後，就會立刻回傳 true，後面的項目不會繼續執行。
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.likedUsers.some(f => f.id === req.user.id)
        res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: 'User' }, { model: User, as: 'FavoritedUsers' }] })
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([Restaurant.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [Category], nest: true, raw: true }),
    Comment.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [Restaurant, User], nest: true, raw: true })])
      .then(([restaurants, comments]) => {
        res.render('feeds', { comments, restaurants })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] })
      .then(restaurants => {
        const result = restaurants.map(rest => ({
          ...rest.toJSON(),// 一定要在這裡toJSON，不能先 nest & row, WHY?
          favoritedCount: rest.FavoritedUsers.length,
          isFavorited: rest.FavoritedUsers.some(f => f.id === req.user.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
        res.render('top-rests', { restaurants: result })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
// /restaurantController 是一個物件 (object)
// restaurantController 有不同的方法，例如 getRestaurants ，這個方法目前是負責「瀏覽餐廳頁面」，也就是去 render 一個叫做 restaurants 的樣板
