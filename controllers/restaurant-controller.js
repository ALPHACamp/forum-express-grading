const {
  Restaurant,
  Category,
  Comment,
  User
} = require('../models')
const {
  getOffset,
  getPagination
} = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 每頁顯示9間餐廳
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId
            ? {
                categoryId
              }
            : {}
        },
        limit,
        offset, // 把limit和offset傳入，這樣sequelize在查詢的時候才知到要查詢幾筆資料
        nest: true,
        raw: true
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
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
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    const {
      Restaurant,
      Category,
      Comment,
      User
    } = require('../models')
    return Restaurant.findByPk(req.params.id, {
      include: [Category,
        {
          model: Comment,
          include: User
        },
        {
          model: User,
          as: 'FavoritedUsers'
        },
        {
          model: User,
          as: 'LikedUsers'
        }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 每點擊一次就要增加一次瀏覽數
        return restaurant.increment('viewCount')
      })
      .then(restaurant => {
        // 遇到符合favorited條件的餐廳就把他回傳回來
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  // 渲染已經有算好瀏覽數的viewCount到前單樣版
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, {
        model: Comment,
        include: User
      }]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ],
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
      include: [{
        model: User,
        as: 'FavoritedUsers'
      }]
      // 限制 10 筆
      // limit: 10
    })
      .then(restaurants => {
        // 篩選出被使用者收藏的餐廳後，要計算收藏的數量，同時也要依照收藏的數量來為這些餐廳排名
        restaurants = restaurants.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          // 計算收藏數量（需要知道length） FavoritedUsers.length
          favoritedCount: r.FavoritedUsers.length,
          // 判斷目前登入使用者是否已追蹤該 restaurant 物件
          // 傳送給面板顯示為移除最愛或加入最愛 isFavorited
          // 檢查那些已經被登入者所收藏的餐廳 id，是否跟篩選出來的餐廳符合
          isFavorited: req.user && req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
        }))
        // 排序 sort
        restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount)
        restaurants = restaurants.slice(0, 10)
        res.render('top-restaurants', {
          restaurants
        })
      })
      .catch(err => next(err))
  }

}

module.exports = restaurantController
