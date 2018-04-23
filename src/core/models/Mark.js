module.exports = function (sequelize, Sequelize) {

    const Mark = sequelize.define('mark', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        score: {
            type: Sequelize.STRING
        },
        themeId: {
            type: Sequelize.UUID,
            reference: {
                model: sequelize.models.theme
            }
        },
        userId: {
            type: Sequelize.UUID,
            reference: {
                model: sequelize.models.user
            }
        }
    });
    Mark.associate = models => {
        Mark.belongsTo(models.user, { foreignKey: 'userId' });
        Mark.belongsTo(models.theme, { foreignKey: 'themeId' });
    };


    Mark.sync();

    return Mark;
};
