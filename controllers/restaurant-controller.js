const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagnation-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 默認該分頁資料拿取上限
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const where = {}
    if (categoryId) where.categoryId = categoryId
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: where,
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        // console.log(favoritedRestaurantsId)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(fr => fr.id)
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
          pagination: getPagination(limit, page, restaurants.count) // 修改這裡，把 pagination 資料傳回樣板
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => { // 此時撈出的資料仍是sequelize的原生格式
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        if (!restaurant) throw new Error("Restaurant didn't exist!") // 如果找不到，回傳錯誤訊息，後面不執行
        restaurant.increment('viewCounts') // 在點進來的時候就增加瀏覽次數
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        }) // 所以也可以用toJSON()去解析，但只有找單筆資料時可以用此方法
      })
      .catch(err => next(err))
  },
  getDashboard: async (req, res, next) => {
    const where = {}
    where.restaurantId = req.params.id
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
    const comments = await Comment.findAndCountAll({
      where: where,
      nest: true,
      raw: true
    })
    const counts = comments.count
    if (!restaurant) throw new Error("Restaurant didn't exist!")
    res.render('dashboard', { restaurant: restaurant.toJSON(), counts }) // 所以也可以用toJSON()去解析，但只有找單筆資料時可以用此方法
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
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' }
      ]
      // Favorite.count({ // 想嘗試用favorite去找出這些關連
      //   attributes: ['restaurantId'],
      //   group: 'restaurantId',
      //   raw: true
      // })
    })
      .then(restaurants => {
        const newData = []
        const data = restaurants
          .map(r => ({
            ...r.toJSON(), // 整理格式
            description: r.description.substring(0, 50), // description縮到50字
            favoritedCount: r.FavoritedUsers.length, // 餐廳被user給favorite的數量
            isFavorited: req.user && req.user.FavoritedRestaurants.some(f => f.id === r.id) // 該user喜歡的餐廳
            // isFavorited: favoritedRestaurantsId.includes(r.id) // 該user喜歡的餐廳
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount) // 按數字反序排列
        for (let i = 0; i < 10; i++) { // 放10個
          newData.push(data[i])
        }
        res.render('top-restaurants', { restaurants: newData })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
