const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const pageLimit = 10                     //每頁10筆資料
const helpers = require('../_helpers.js')
const getTestUser = function(req){
  if (process.env.NODE_ENV === 'test'){
    return helpers.getUser(req)
  }else{ return req.user }
  }

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0                       //
    const whereQuery = {}
    let categoryId = ''
    const user = getTestUser(req)
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }
    Restaurant.findAndCountAll({ //return 出來會是下面有 count 與 rows, 其中count是數字而rows的結構和findAll返回的obj類似，也會有dataValues
      include: Category, where: whereQuery, offset: offset, limit: pageLimit })
      .then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => {
        const str = r.dataValues.description
        let shortenStr = str.split(' ').slice(0,15).join(" ")
        return {
        ...r.dataValues,
        description: shortenStr+"...",
        categoryName: r.dataValues.Category.name,
        isFavorited: user.FavoritedRestaurants.map(d => d.id).includes(r.id), 
        isLiked: user.LikedRestaurants.map(d => d.id).includes(r.id) 
      }
    })
      Category.findAll({ raw: true, nest: true })
      .then(categories => { return res.render('restaurants', {
          restaurants: data, categories, categoryId, page, totalPage, prev, next 
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    const user = getTestUser(req)
    Restaurant.findByPk(req.params.id, {
      include:[Category, 
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User]}],  //eager loading
      }) 
      .then((restaurant) => {
        restaurant.viewCounts ++
        restaurant.save()
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(user.id)
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(user.id)
        return res.render('restaurant', { restaurant:restaurant.toJSON(), isFavorited, isLiked })
      })                                                
      .catch(err => res.status(422).json(err))                 
  },
  
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10, raw: true, nest: true,
        order: [['createdAt', 'DESC']], include: [Category] }),
      Comment.findAll({
        limit: 10, raw: true, nest: true,
        order: [['createdAt', 'DESC']], include: [User, Restaurant]})
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })})},

  getDashboards: (req,res) => {
    Promise.all([
      Comment.count({where:{RestaurantId:req.params.id}}), //cmtCount
      Restaurant.findByPk(req.params.id, {include: Category, raw:true, nest:true})
    ])
    .then(([cmtCount, restaurant]) => {
      res.render('dashboard', {cmtCount, restaurant})
    })
    .catch(err => res.status(422).json(err))    
  },

  getTopRestaurant: (req, res) => {
    const user = getTestUser(req)
    return Restaurant.findAll({ include: [
      { model: User, as: 'FavoritedUsers', raw:true, nest:true },
      { model: User, as: 'LikedUsers', raw:true, nest:true }
    ]})
    .then(restaurants => {
      let data = restaurants.map(r => ({
        ...r.dataValues,
        favlength: r.dataValues.FavoritedUsers.length,
        isFavorited: user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: user.LikedRestaurants.map(d => d.id).includes(r.id),
      }))
      data.sort(function(a, b){ return b.favlength - a.favlength})
      return data.slice(0, 9)      
    })
    .then(restaurants => {
      return res.render('toprestaurant', { restaurants: restaurants })
    })
  },
 }

module.exports = restController