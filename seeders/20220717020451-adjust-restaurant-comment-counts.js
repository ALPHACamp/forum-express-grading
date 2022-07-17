'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const datas = await queryInterface.sequelize.query('SELECT restaurants.id, COUNT(comments.restaurant_id) AS comment_counts FROM restaurants JOIN forum.comments ON restaurants.id = comments.restaurant_id GROUP BY comments.restaurant_id ORDER BY comment_counts DESC;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    await Promise.all(
      datas.map(async data => {
        await queryInterface.bulkUpdate(
          'Restaurants',
          {
            comment_counts: data.comment_counts
          },
          {
            id: data.id
          }
        )
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('Restaurants', { comment_counts: 0 })
  }
}
