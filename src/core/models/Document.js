module.exports = function (sequelize, Sequelize) {
    const Document = sequelize.define('document', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        file: {
            type: Sequelize.STRING
        },
        themeId: {
            type: Sequelize.UUID,
            reference: {
                model: sequelize.models.theme,
                key: 'id'
            }
        }
    });

    Document.associate = models => {
        Document.belongsTo(models.theme, { foreignKey: 'themeId' });
    };

    Document.sync();

    return Document;
};