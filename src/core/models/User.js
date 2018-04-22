const Sequelize = require('sequelize');
//
const sequelize = require('../../libs/sequelize');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            min: 4
        }
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: 'student',
        validate: {
            isIn: [['student', 'teacher']]
        }
    },
    position: {
        type: Sequelize.STRING
    },
    group: {
        type: Sequelize.STRING
    }
}, {
        timestamps: true
    });

User.sync();

module.exports = User;