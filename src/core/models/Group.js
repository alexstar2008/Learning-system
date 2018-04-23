const Sequelize = require('sequelize');
//
const sequelize = require('../../libs/sequelize');

const Group = sequelize.define('Group', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    course: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
Group.sync();

module.exports = Group;