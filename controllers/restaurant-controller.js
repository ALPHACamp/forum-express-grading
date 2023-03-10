const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const assert = require('assert') // 練習用assert

const restaurantController = {
  getRestaurants: (req, res, next) => { // 瀏覽所有餐廳頁面:運用展開運算子 ...
    const DEFAULT_LIMIT = 9 // 依照devTools來觀察適合一頁放幾筆

    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串，先轉成 Number 再操作

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    // const where = {}
    // if (categoryId) where.categoryId = categoryId
    return Promise.all([
      Restaurant.findAndCountAll({ // 幫忙數總共會有幾筆
        include: Category,
        // where: where,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurants = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({ // 多rows來包原本的資料
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurants.includes(r.id)
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
  getRestaurant: (req, res, next) => { // 瀏覽單筆餐廳頁面
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(restaurant => {
      assert(restaurant, "Restaurant didn't exist!")
      // if (!restaurant) throw new Error("Restaurant didn't exist!")
      return restaurant.increment('viewCounts')
    }).then(restaurant => {
      // 運用some來做迭代,只要一個符合條件的就會立刻回傳停止後方搜尋,做單筆資料搜尋來說更有效率
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => { // 最新動態:運用order來排序所需要的條件
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
  getTopRestaurants: (req, res, next) => { // 前10人氣餐廳
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        const result = restaurants.map(r => ({
          ...r.toJSON(),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.map(fr => fr.id).includes(r.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount) // (b-a) 降序並取出前10
          .slice(0, 10)
        res.render('top-restaurants', { restaurants: result })
      })
  }
}
module.exports = restaurantController
