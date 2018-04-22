const Sequelize = require('sequelize');
//
const config = require('../../config');

const sequelize = new Sequelize(config.db.url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
});

sequelize.authenticate().then(() => {
    console.log(`Postgres is started`);
});

module.exports = sequelize;