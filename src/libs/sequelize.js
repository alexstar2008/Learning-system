const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
//
const config = require('../../config');
const db = {};
//
const sequelize = new Sequelize(config.db.url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
});
sequelize.authenticate().then(() => {
    console.log(`Postgres is started`);
});

const files =
    fs.readdirSync(__dirname + '/../core/models')
        .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
        .forEach(file => {
            const model = sequelize['import'](path.join(__dirname + '/../core/models', file));
            db[model.name] = model;
        });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
