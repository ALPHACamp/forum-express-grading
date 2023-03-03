/* For front-end system */

const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // note 避免有magic number(意指找不到為何定義的數字)，所以都要另外做個變數讓別人知道這個數字的意義為何，像是limit and substring
    const SUBSTRING_END = 50
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    // Thinking 使用where時，因前面有ifCond做條件判斷，所以用三元運算子來進行，而多加個spread operator則是若傳進來的為物件，則可以個別使用。
    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          // notice where這個做法可以在後面多加好幾個條件，以便於未來擴充查詢條件。spread operator優先級較低，會先執行三元運算子後再執行spread operator
          ...categoryId ? { categoryId } : {}
        },
        limit, // note 限制顯示的個數
        offset
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // notice 使用findAndCountAll 會產生count以及物件被rows包住，所以後面使用要變成restaurants.count and restaurants.rows
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)

        const data = restaurants.rows.map(r => ({
          // note spread operator可以把重複的項目以後面的為基準取代前面的，所以description變成所要的50個字以內
          ...r,
          description: r.description.substring(0, SUBSTRING_END),
          isFavorited: favoritedRestaurantsId.includes(r.id)
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
    // notice 有關兩個以上table的關聯使用上，用include來結合，include: { model: XXX, as: 'abc'} => 關聯XXX的table並以abc的名字作為別名，所以console後會出現abc來取代物件XXX的名字，若沒有as設定別名的話，則會以XXXs作為名稱來操作
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' }
      ],
      // note 使comment按照時間排序 order: [tableNAme, 'filedName', 'DESC or ASC]
      order: [
        [Comment, 'createdAt', 'DESC']
      ]
    })
      .then(restaurant => {
        // notice 建議console出來以了解output格式的變化
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        // note 導入瀏覽增加次數
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)

        // note 因要操作資料庫，所以不使用raw來進行，所以導入變數的時候要先進行純JS的格式化
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    // notice 使用raw時，會把comments的整體內容與長度都被清理掉，因此要傳遞length的話則需要用到sequelize操作
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return res.render('dashboard', { restaurant: restaurant.toJSON() })
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
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  }
};

module.exports = restaurantController;
