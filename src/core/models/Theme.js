module.exports = function (sequelize, Sequelize) {
    const Theme = sequelize.define('theme', {
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
        desc: {
            type: Sequelize.STRING
        }
    }, {
            timestamps: false
        });
    Theme.associate = models => {
        Theme.hasOne(models.question);
        Theme.hasMany(models.mark);
        Theme.hasMany(models.document, { foreignKey: 'themeId' });
    };


    Theme.sync();



    return Theme;
};
