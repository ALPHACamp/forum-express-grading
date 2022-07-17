'use strict'
const db = require('../models')
const { Restaurant } = db

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const datas = await queryInterface.sequelize.query('SELECT restaurants.id, COUNT(comments.restaurant_id) AS comment_counts FROM restaurants JOIN forum.comments ON restaurants.id = comments.restaurant_id GROUP BY comments.restaurant_id ORDER BY comment_counts DESC;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    await Promise.all(
      datas.map(async data => {
        const restaurant = await Restaurant.findByPk(data.id)
        await restaurant.update({ commentCounts: data.comment_counts })
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    const restaurants = await Restaurant.findAll()
    await Promise.all(
      restaurants.map(async restaurant => {
        await restaurant.update({ commentCounts: 0 })
      })
    )
  }
}
