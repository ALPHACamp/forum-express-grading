/* For back-end system */
const { Restaurant } = require('../models');

const adminController = {
  // the object
  getRestaurants: (req, res, next) => {
    //  note raw 是讓資料呈現簡化為單純的JS物件，若是不加的話，則會是原生Sequelize的instance，除非需要對後續取得的資料操作，才不加。
    Restaurant.findAll({ raw: true })
      .then(restaurants => {
        // console.log(restaurants);
        res.render('admin/restaurants', { restaurants });
      })
      .catch(err => next(err));
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant');
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body;
    // !! note 雖然前端有用required來驗證，但是容易被修改，所以要在後端做一次驗證，避免被直接修改或侵入
    if (!name) throw new Error('Restaurant name is required');
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', 'Restaurant was created successfully');
        res.redirect('/admin/restaurants');
      })
      .catch(err => next(err));
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.res_id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist");

        res.render('admin/restaurant', { restaurant });
      })
      .catch(err => next(err));
  }
};

module.exports = adminController;
