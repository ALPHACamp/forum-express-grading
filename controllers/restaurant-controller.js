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
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
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
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => { // 此時撈出的資料仍是sequelize的原生格式
        if (!restaurant) throw new Error("Restaurant didn't exist!") // 如果找不到，回傳錯誤訊息，後面不執行
        restaurant.increment('viewCounts') // 在點進來的時候就增加瀏覽次數
        res.render('restaurant', { restaurant: restaurant.toJSON() }) // 所以也可以用toJSON()去解析，但只有找單筆資料時可以用此方法
      })
      .catch(err => next(err))
  },
  getDashboard: async (req, res, next) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
    if (!restaurant) throw new Error("Restaurant didn't exist!")
    res.render('dashboard', { restaurant: restaurant.toJSON() }) // 所以也可以用toJSON()去解析，但只有找單筆資料時可以用此方法
  }
}
module.exports = restaurantController
