// mvc分流裡的controller

const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // 將categoryId轉成數字或者為空(為全部做準備)
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([Restaurant.findAll({
      include: Category,
      // 當使用者點選的是「全部」這個頁籤時，categoryId 會是空值。設定 where 查詢條件時，撈出全部where: {}
      // categoryId=true=...{categoryId}
      where: { ...categoryId ? { categoryId } : {} },
      nest: true,
      raw: true
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })// 回傳給hbs是否需要active
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category, nest: true, raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
// /restaurantController 是一個物件 (object)
// restaurantController 有不同的方法，例如 getRestaurants ，這個方法目前是負責「瀏覽餐廳頁面」，也就是去 render 一個叫做 restaurants 的樣板
