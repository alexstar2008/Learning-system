module.exports = function (sequelize, Sequelize) {
    const Group = sequelize.define('group', {
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
    Group.associate = models => {
        Group.hasMany(models.user, { foreignKey: 'groupId' });
    };
    Group.sync();

    return Group;
};
