const { Restaurant, Category, User, Comment } = require('../models')
const { deletedCategoryFilter } = require('../helpers/deleted-filter-helper')
const { getOffset, getPagination } = require('../helpers/pagination-helpler')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 注意req.query是字串要轉型別，全部要給空字串
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
          // 要注意空物件永遠是true，這邊用成物件展開是為了擴充 實際上拿掉也可以跑
        },
        limit,
        offset
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        restaurants.rows = restaurants.rows.map(r => ({ // 小括號代替return,注意這裡不能改整個restaurants,要選rows
          ...r,
          description: r.description.substring(0, 50) // 雖然展開的時候也有屬性了，但後面的keyvalue可以覆蓋前面的keyvalue
        })
        )
        categories = deletedCategoryFilter(categories)
        return res.render('restaurants', {
          restaurants: restaurants.rows, // 注意這裡要用rows
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
        { model: Comment, include: User },
        Category],
      order: [
        [Comment, 'createdAt', 'DESC'] // 新的時間在上面
      ]
      // EagerLoading會自動幫你抓外鍵對應的資料
      // 注意返回的資料類型hasMany為物件陣列，belongsTo為物件
    })
      .then(async restaurant => {
        if (!restaurant) throw new Error('此餐廳不存在')
        await restaurant.increment('viewCounts')
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      { include: [Category, Comment] }
    )
      .then(restaurant => {
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']], // (!)不要用到空白
        include: [Category],
        limit: 10
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        include: [Restaurant, User],
        limit: 10,
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([restaurants, comments]) => {
        console.log(restaurants, comments)
        return res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
