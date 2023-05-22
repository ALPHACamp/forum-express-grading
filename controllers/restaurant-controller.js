const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId) || ''
    const where = {}
    if (categoryId) where.categoryId = categoryId
    Promise.all([
      Restaurant.findAll({
        include: Category,
        // where, // 來源: Sequelize的find({where:{categoryId}})
        where: {
          ...categoryId ? { categoryId } : {}
          // 展開運算子順序較低，先進行 categoryId 之三元運算子再展開categoryId結果
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
