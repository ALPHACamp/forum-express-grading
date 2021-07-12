'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'description', {
      type: Sequelize.STRING(255)
    })
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING(127),
      defaultValue: 'https://cdn.dribbble.com/users/3117394/screenshots/6979664/kaonashi_still_2x.gif'
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'description')
    await queryInterface.removeColumn('Users', 'image')
  }
};
