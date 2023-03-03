'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const result = []
    for (let i = 0; i < users.length; i++) {
      const followerId = users[i].id
      const newUsers = Array.from(users)
      newUsers.splice(i, 1) // 回傳刪除user[i]後的新陣列

      const followingQuantity = Math.floor(Math.random() * 5) + 1 // 隨機選擇要追蹤的人數(1~5人)
      for (let n = 1; n <= followingQuantity; n++) {
        const followingIndex = Math.floor(Math.random() * newUsers.length)
        const followingId = newUsers[followingIndex].id
        result.push({
          follower_id: followerId,
          following_id: followingId,
          created_at: new Date(),
          updated_at: new Date()
        })
        newUsers.splice(followingIndex, 1)
      }
    }
    // console.log(result.map(r => r.followerId === r.followingId))

    await queryInterface.bulkInsert('Followships', result)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
