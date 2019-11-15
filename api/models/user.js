const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    class User extends Sequelize.Model { }

    User.init({
        firstName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"firstName" is required'
                },
                notNull: {
                    msg: 'Missing a "firstName"'
                }
            },
            allowNull: false,
            defaultValue: ''
        },
        lastName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"lastName" is required'
                }
            },
            allowNull: false,
            defaultValue: ''

        },
        emailAddress: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"email" is required'
                },
                isEmail: {
                    msg: 'Must be a valid email "name@example.com"'
                }
            },
            allowNull: false,
            unique: true,
            defaultValue: ''
        },
        password: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"password" is required'
                }
            },
            allowNull: false,
            defaultValue: ''
        }
    }
        , { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return User;
}