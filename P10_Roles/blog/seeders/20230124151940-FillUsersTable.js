'use strict';

var crypt = require('../helpers/crypt');

module.exports = {
    up(queryInterface, Sequelize) {
        const salt = crypt.generateSalt();

        return queryInterface.bulkInsert('users', [{
                username: 'admin',
                email: 'admin@core.example',
                password: crypt.encryptPassword('1234', salt),
                salt,
                isAdmin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: 'pepe',
                email: 'pepe@core.example',
                password: crypt.encryptPassword('5678', salt),
                salt,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
};
