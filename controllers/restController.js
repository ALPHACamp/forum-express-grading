const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const pageLimit = 10                     //每頁10筆資料




const restController = {
  getRestaurants: (req, res) => {
    let offset = 0                       //
    const whereQuery = {}
    let categoryId = ''
    
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
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name
      }))
      Category.findAll({ raw: true, nest: true })
      .then(categories => { return res.render('restaurants', {
          restaurants: data, categories, categoryId, page, totalPage, prev, next 
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include:[Category, { model: Comment, include: [User]}],  //eager loading
      })  
      .then((restaurant) => { 
        res.render('restaurant', { restaurant:restaurant.toJSON() } //看似可以用 raw:true nest:true 來簡化
        )})                                                         //，實際上一對多的comments會跑不出來
      .catch(err => res.status(422).json(err))                      //必須使用toJSON()
    }
    
  
}

module.exports = restController