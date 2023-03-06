/* For front-end system */

const { Restaurant, Category, Comment, User, Favorite } = require('../models')
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
        // Thinking 要帶入與user table相關聯的資料，需要先到passport的反序列做修正，因使用者資料都會先經過passport驗證並序列化。

        const favoritedRestaurantsIds = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)

        const likedRestaurantsIds = req.user?.LikedRestaurants.map(fr => fr.id) || []

        // notice 使用findAndCountAll 會產生count以及物件被rows包住，所以後面使用要變成restaurants.count and restaurants.rows
        const data = restaurants.rows.map(r => ({
          // note spread operator可以把重複的項目以後面的為基準取代前面的，所以description變成所要的50個字以內
          ...r,
          description: r.description.substring(0, SUBSTRING_END),
          isFavorited: favoritedRestaurantsIds.includes(r.id),
          isLiked: likedRestaurantsIds.includes(r.id)
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
    // notice 有關兩個以上table的關聯查詢使用上，用include來結合，include: { model: XXX, as: 'abc'} => 關聯XXX的table並以abc的名字作為別名，所以console後會出現abc來取代物件XXX的名字，若沒有as設定別名的話，則會以XXXs作為名稱來操作(可以關聯同一個table但是取不同的別名)
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
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

        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)

        // note 因要操作資料庫，所以不使用raw來進行，所以導入變數的時候要先進行純JS的格式化
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const restaurantId = req.params.id

    // notice 使用raw時，會把comments的整體內容與長度都被清理掉，因此要傳遞length的話則需要用到sequelize操作
    return Promise.all([
      Restaurant.findByPk(restaurantId, {
        nest: true,
        include: [
          Category,
          { model: Comment }
        ]
      }),
      // Thinking Favorite在model裡面並未設定對Restaurant以及user的關聯性，因此要採用include的做法，必須要像Comment一樣在model裡面設定關聯性，才有辦法套用到。
      Favorite.findAndCountAll({
        where: { restaurantId },
        raw: true,
        nest: true
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return res.render('dashboard', { restaurant: restaurant.toJSON(), favorite })
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
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const modifiedRestaurants = restaurants.map(rest => ({
          ...rest.toJSON(),
          favoritedCount: rest.FavoritedUsers.length,
          isFavorited: req.user?.FavoritedRestaurants.some(f => f.id === rest.id) || []
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        res.render('top-restaurants', { restaurants: modifiedRestaurants })
      })
      .catch(err => next(err))
  }
};

module.exports = restaurantController;
