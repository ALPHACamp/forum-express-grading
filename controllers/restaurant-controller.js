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
        const favoritedRestaurantsId =
          req.user && req.user.FavoritedRestaurants.map(fr => fr.id) // 防req.user是空的。map會產生一個陣列。若放在data裡面，一頁有9家，這動作就要跑9次，但結果都相同，會沒效率，所以獨立出來。
        const likedRestaurantsId =
          req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, shortDescriptionLength),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        // console.log("favoritedRestaurantsId", favoritedRestaurantsId); // favoritedRestaurantsId [ 2, 3 ]
        // console.log("data", data);
        // data [
        //   {
        //     id: 1,
        //     name: 'Lauren Strosin',
        //     tel: '(854) 746-2410 x635',
        //     address: '9067 Gracie Forest',
        //     openingHours: '08:00',
        //     description: 'Saepe qui qui dolore ullam qui. Molestiae qui offi',
        //     image: 'https://loremflickr.com/320/240/restaurant,food/?random=98.19748241873347',
        //     viewCounts: 7,
        //     createdAt: 2022-12-01T08:22:55.000Z,
        //     updatedAt: 2022-12-02T07:55:41.000Z,
        //     categoryId: 5,
        //     Category: {
        //       id: 5,
        //       name: '素食料理',
        //       createdAt: 2022-12-01T08:22:54.000Z,
        //       updatedAt: 2022-12-01T08:22:54.000Z
        //     },
        //     isFavorited: false
        //   },{},{}...頁面上9個
        // ]
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
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ], // 拿出關聯的 Category model及 預先加載
      // 找Restaurant的Category、找Restaurant的Comment、找Restaurant的Comment的User。以此類推
      order: [[Comment, 'createdAt', 'desc']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts', { by: 1 }) // 小寫restaurant
      })
      .then(restaurant => {
        // console.log(restaurant.FavoritedUsers); 回傳一陣列，假設這餐廳有兩個收藏者，如下
        // [User{},User{}]，內容為此2使用者的user表資料
        // some測試陣列中是否至少有一個元素，一找到就結束(回傳布林值)，map則會全部跑完
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(), // toJSON大小寫要全對
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurant => {
        // console.log(restaurant);
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
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
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const topCount = 10
        const result = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited:
              req.user &&
              req.user.FavoritedRestaurants.some(f => f.id === restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, topCount)

        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}

// 匯出之後才能在其他檔案裡使用。
module.exports = restaurantController
