const { Restaurant, User, Category } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const adminServices = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(null, { restaurants }))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    User.findAll({
      raw: true,
      nest: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  // patchUser: (req, cb) => {
  //   return User.findByPk(req.params.id)
  //     .then(user => {
  //       if (user.email === 'root@example.com') {
  //         req.flash('error_messages', '禁止變更 superuser 權限')
  //         return res.redirect('back')
  //       }
  //       else {
  //         console.log(user,{
  //           raw: true,
  //           nest: true
  //         })
  //         return user.update({
  //           isAdmin: user.isAdmin ? '0' : '1'
  //         })
  //       }
  //     })
  //     .then(users => cb(null, { users }))
  //     .catch(err => cb(err))
  // },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(deletedRestaurant => cb(null, { restaurant: deletedRestaurant }))
      .catch(err => cb(err))
  },
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
