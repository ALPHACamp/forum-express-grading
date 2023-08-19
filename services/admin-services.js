const { Restaurant, Category } = require('../models')
// const { imgurFileHandler } = require('../../helpers/file-helpers')
const adminServices = { // 修改這裡
  getRestaurants: (req, cb) => {
    Restaurant.findAll({

      raw: true,
      nest: true,
      include: [Category]

    })

      .then(restaurants => {
        return cb(null, { restaurants })
      })
      .catch(err => cb(err))
  }
}
module.exports = adminServices
