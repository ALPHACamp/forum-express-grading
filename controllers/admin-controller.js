const {
  Restaurant,
  User
} = require('../models')

const {
  imgurFileHandler
} = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', {
        restaurants
      }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const {
      name,
      tel,
      address,
      openingHours,
      description
    } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const {
      file
    } = req

    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('admin/restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('admin/edit-restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const {
      name,
      tel,
      address,
      openingHours,
      description
    } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const {
      file
    } = req

    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  // 顯示全部的使用者
  getUsers: (req, res, next) => {
    // 回傳全部找到的使用者
    return User.findAll({
      raw: true
    })
      // 將使用者顯示在admin樣板中
      .then(users => res.render('admin/users', {
        users: users
      }))
      // 抓取錯誤
      .catch(err => next(err))
  },
  // 切換使用者的權限
  patchUser: (req, res, next) => {
    // 利用Mysql的findByPk找到所要尋找的特定user id
    return User.findByPk(req.params.id)
    // 找到該user
      .then(user => {
      // 如果該user不存在，回傳User didn't exist!的錯誤訊息
        if (!user) throw new Error("User didn't exist!")
        // 如果該user 的email等於root@example.com則丟出錯誤訊息
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          // 回傳回到上一步
          return res.redirect('back')
        }
        // 如果沒有不存在使用者或等於root得情形，則進行update
        return user.update({
          isAdmin: !user.isAdmin
        })
          .then(() => {
            // 回傳成功訊息
            req.flash('success_messages', '使用者權限變更成功')
            res.redirect('/admin/users')
          })
      })
    // 捕捉錯誤訊息
      .catch(err => next(err))
  }
}
module.exports = adminController
