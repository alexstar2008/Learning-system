module.exports = function (sequelize, Sequelize) {

    const Question = sequelize.define('question', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            defaultValue: 'single'
        },
        themeId: {
            type: Sequelize.UUID,
            reference: {
                model: sequelize.models.theme,
                key: 'id'
            }
        }
    }, {
        timestamps: false
    });
    Question.associate = models => {
        Question.belongsTo(models.theme, { foreignKey: 'themeId' });
        Question.hasMany(models.answer, { foreignKey: 'questionId' });
    };


    Question.sync();

    return Question;
}
