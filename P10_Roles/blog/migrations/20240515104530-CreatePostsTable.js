'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Posts',{
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
              unique: true
          },
          title: {
              type: Sequelize.STRING,
              validate: {notEmpty: {msg: "Title must not be empty."}}
          },
          
          body: {
              type: Sequelize.TEXT,
              validate: {notEmpty: {msg: "Body must not be empty."}}
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
          }
    });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('Posts');
  }
};
