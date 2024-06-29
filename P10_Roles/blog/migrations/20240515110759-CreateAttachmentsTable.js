'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Attachments',{
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
              unique: true
          },
          mime: {
              type: Sequelize.STRING 
          },
          image: {
            type: Sequelize.BLOB("long")
          },
          postId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Posts',
              key: 'id'
            },
            onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Attachments');
  }
};
