// 建立一個名為 restaurantController 的object
// restaurantController object 中有一個方法叫做 getRestaurants，負責「瀏覽餐廳頁面」，也就是去 render 名為 restaurants 的hbs

const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = +req.query.categoryId || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: [Category],
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // 把撈到的 restaurants 資料經過以下3步驟處理並存成 data，才把 data 交給 hbs
        // 步驟1. 把每一間餐廳的描述受限只有50字
        // 步驟2&3. 增加叫做 isFavorited 和 isLike 的屬性，其 value 是布林值，看這間餐廳是不是有被使用者收藏或喜歡（有=1，沒有=0）

        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likeRestaurantsId = req.user && req.user.LikeRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLike: likeRestaurantsId.includes(r.id)
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
        { model: User, as: 'LikeUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('view_counts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id) // isFavorited 是一個布林值
        const isLike = restaurant.LikeUsers.some(lu => lu.id === req.user.id) // isLike 是一個布林值
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLike
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
  },
  getFeeds: (req, res, next) => {
    // 最新動態定義：最新建立的10筆餐廳＆最新建立的10筆評論
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']], // order接受的參數是一組陣列，例如[['createdAt', 'DESC'], ['name', 'ASC']]
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
        return res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    const displayRestaurantNumber = 10
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const data = restaurants
          .map(r => ({
            ...r.toJSON(),
            description: r.description.substring(0, 100),
            favoritedCount: r.FavoritedUsers.length,
            isFavorited: req.user?.FavoritedRestaurants.some(fr => fr.id === r.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, displayRestaurantNumber)
        return res.render('top-restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
