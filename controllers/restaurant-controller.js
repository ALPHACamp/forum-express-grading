// 負責處理前台餐廳相關的請求 (request)
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  // restaurantController是一個物件
  // getRestaurants負責處理瀏覽餐廳頁面的函式，主要為render restaurants 的樣板
  getRestaurants: (req, res, next) => {
    // 因為handlebars中，有categories，因此這裡需要去抓Category的資料。
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // categoryId的值是從網址上提取上來(req.query)
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        limit,
        offset,
        include: [Category],
        where: {
          ...(categoryId ? { categoryId } : {})
        }
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId =
          req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likeRestaurantsId =
          req.user && req.user.LikedRestaurants.map(tw => tw.id)

        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likeRestaurantsId.includes(r.id)
        }))

        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // restaurants.count為findAndCountAll的返回值
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: User }]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('此restaurant不存在')

        return restaurant.increment('viewCounts')
      })

      .then(() => {
        return Restaurant.findByPk(req.params.id, {
          include: [
            Category,
            { model: Comment, include: User },
            // 使用「現在的使用者」是否有出現在收藏「這間餐廳的收藏使用者列表」裡面
            // 也可以使用「現在這間餐廳」是否有出現在「使用者的收藏清單」裡面
            { model: User, as: 'FavoritedUsers' },
            { model: User, as: 'LikedUsers' }
          ] // 使用FavoritedUsers，讓電腦得知是使用哪種關係]
        })
      })

      .then(updateRestaurant => {
        const isFavorited = updateRestaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
        const isLiked = updateRestaurant.LikedUsers.some(
          d => d.id === req.user.id
        )
        res.render('restaurant', {
          restaurant: updateRestaurant.toJSON(),
          isFavorited,
          isLiked
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
        if (!restaurant) throw new Error('無法獲取更新後的restaurant')

        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    // 需同時取完才能進去下階段，因此使用了Promise.all
    Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [User, Restaurant]
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
        const Newrestaurants = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            description: restaurant.description.substring(0, 200),
            favoritedCount: restaurant.FavoritedUsers.length,
            // 在使用 req.user 之前，增加一個檢查來確保它不是 undefined
            isFavorited: req.user
              ? restaurant.FavoritedUsers.some(f => f.id === req.user.id)
              : false
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants: Newrestaurants })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
