const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }

    Course.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"title" is required'
                },
            },
            allowNull: false,
            defaultValue: ''
        },
        description: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: {
                    msg: '"description" is required'
                },
            },
            allowNull: false,
            defaultValue: ''
        },

        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Course;
}