const adminServices = require('../../services/admin-services')
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  },
  deleteRestaurant: (req, res, next) => { // 新增以下
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = adminController
