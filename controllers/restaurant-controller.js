// 引入model
const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res, next) => {
    // 宣告預設limit變數
    const DEFAULT_LIMIT = 9

    // 取得查詢條資料
    const categoryId = Number(req.query.categoryId) || '' // 查詢條件為字串，先將資料轉成數值再操作
    const page = Number(req.query.page) || 1 // 若無page條件，預設為1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 若無limit條件，預設為DEFAULT_LIMIT

    const offset = getOffset(limit, page)

    Promise.all([
      // 尋找全部restaurant資料，並關連category
      Restaurant.findAndCountAll({
        include: Category,
        // 增加查詢條件
        where: {
          ...categoryId ? { categoryId } : {} // 若categoryId為true，回傳物件categoryId，若無回傳空物件，再使用展開運算子展開物件
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      // 尋找全部category資料
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // 新增變數data，取得map回傳陣列
        const data = restaurants.rows.map(r => ({
          ...r, // 展開r的物件
          description: r.description.substring(0, 50) // 將餐廳描述截為50字
        }))
        // 渲染restaurants
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },

  // 瀏覽特定餐廳詳細資訊
  getRestaurant: (req, res, next) => {
    // 查詢動態id的restaurant資料，並關連category
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        // 若查詢不到資料，回傳錯誤訊息
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        // 更新資料庫viewCounts值 + 1
        return restaurant.increment('viewCounts')
      })
      // 渲染restaurant頁面，將參數轉換成普通物件並帶入
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },

  // 瀏覽特定餐廳的點擊次數
  getDashboard: (req, res, next) => {
    // 查詢動態路由的restaurant資料，並關聯category
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        // 若查詢不到資料，回傳錯誤訊息
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        // 渲染dashboard頁面，並帶入參數
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },

  // 瀏覽feeds頁面
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({ // 查詢10筆餐餐，以createdAt降冪排列
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({ // 查詢10筆評論，以createdAt降冪排列
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', { restaurants, comments })
      })
  }
}

// 匯出模組
module.exports = restaurantController
