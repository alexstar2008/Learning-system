module.exports = function (sequelize, Sequelize) {
    const User = sequelize.define('user', {
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
        }
    }, {
            timestamps: true
        });

    User.associate = models => {
        User.hasMany(models.mark, { foreignKey: 'userId' });
        User.belongsTo(models.group, { foreignKey: 'groupId' });
    };


    User.sync();

    return User;
};
