/* For front-end system */

const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        // note spread operator可以把重複的項目已後面的為基準取代前面的，所以description變成所要的50個字以內
        ...r,
        description: r.description.substring(0, 50)
      }))

      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
};

module.exports = restaurantController;
