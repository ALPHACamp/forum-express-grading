/* For back-end system */
const { Restaurant } = require('../models');

const adminController = {
  // the object
  getRestaurants: (req, res, next) => {
    //  note raw 是讓資料呈現簡化為單純的JS物件，若是不加的話，則會是原生Sequelize的instance，除非需要對後續取得的資料操作，才不加。
    Restaurant.findAll({ raw: true })
      .then(restaurants => {
        console.log(restaurants);
        res.render('admin/restaurants', { restaurants });
      })
      .catch(err => next(err));
  }
};

module.exports = adminController;
