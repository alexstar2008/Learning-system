
module.exports = function (sequelize, Sequelize) {
    const Answer = sequelize.define('answer', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        correct: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        questionId: {
            type: Sequelize.UUID,
            reference: {
                model: sequelize.models.question,
                key: 'id'
            }
        }
    },{
        timestamps: false
    });
    Answer.associate = models => {
        Answer.belongsTo(models.question, { foreignKey: 'questionId' });
    };

    Answer.sync();

    return Answer;
}
