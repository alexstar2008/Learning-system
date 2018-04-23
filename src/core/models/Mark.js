module.exports = function (sequelize, Sequelize) {

    const Mark = sequelize.define('mark', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        score: {
            type: Sequelize.STRING
        }
    });
    Mark.associate = models => {
        Mark.belongsTo(models.theme, { foreignKey: 'theme_id' });
    };


    Mark.sync();

    return Mark;
};
