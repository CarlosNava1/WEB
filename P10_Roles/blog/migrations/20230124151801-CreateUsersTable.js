'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                validate: { notEmpty: { msg: "El nombre de usuario no debe estar vacío." } }
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: { isEmail: { msg: "El formato del correo electrónico no es válido." } }
            },
            password: {
                type: Sequelize.STRING,
                validate: { notEmpty: { msg: "La contraseña no debe estar vacía." } }
            },
            salt: {
                type: Sequelize.STRING
            },
            isAdmin: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }, {
            sync: { force: true }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};

 
