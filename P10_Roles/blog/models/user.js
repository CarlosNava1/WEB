'use strict';

const {Model, DataTypes} = require('sequelize');
const crypt = require('../helpers/crypt');

// Definition of the User model:
module.exports = (sequelize) => {

    class User extends Model {
        verifyPassword(password) {
            return crypt.encryptPassword(password, this.salt) === this.password;
        }
    }

    User.init({
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {notEmpty: {msg: "Username must not be empty."}}
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: { isEmail: { msg: "El formato del correo electrónico no es válido." } }
            },
            password: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Password must not be empty."}},
                set(password) {
                    // Random String used as salt.
                    this.salt = crypt.generateSalt();
                    this.setDataValue('password', crypt.encryptPassword(password, this.salt));
                }
            },
            salt: {
                type: DataTypes.STRING
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize
        }
    );

    return User;
};


