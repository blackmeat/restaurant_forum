'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "image")
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "image", {
      type: Sequelize.STRING
    })
  }
};
