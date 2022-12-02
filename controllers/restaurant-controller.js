// restaurantController 是一個物件 (object)。
// restaurantController 有不同的方法，例如 getRestaurants
const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res) => {
    const shortDescriptionLength = 50
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 若以後想在query設計成可供使用者選擇每頁幾個
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || '' // query網址列是字串所以要轉數字
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: { ...(categoryId ? { categoryId } : {}) }, // 優先級為:先判斷是否，再展開...
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, shortDescriptionLength)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId, // 才可以判斷active
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: User }], // 拿出關聯的 Category model及 預先加載
      // 找Restaurant的Category、找Restaurant的Comment、找Restaurant的Comment的User
      order: [[Comment, 'createdAt', 'desc']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts', { by: 1 }) // 小寫restaurant
      })
      .then(restaurant => {
        // console.log("A-", restaurant, "B-", restaurant.toJSON());
        // const allComments = restaurant.toJSON().Comments;
        // const sortedDescComments = [...allComments].sort(
        //   (objA, objB) => Number(objB.updatedAt) - Number(objA.updatedAt)
        // );
        // console.log(sortedDesc);
        res.render('restaurant', {
          restaurant: restaurant.toJSON() // toJSON大小寫要全對
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        // console.log(restaurant);
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']], // 陣列包陣列，要多組條件排序的話為[[],[],[]...]
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

// 匯出之後才能在其他檔案裡使用。
module.exports = restaurantController
