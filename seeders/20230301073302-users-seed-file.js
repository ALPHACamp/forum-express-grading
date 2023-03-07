'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: true,
          name: 'root',
          image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user1',
          image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user2',
          image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
