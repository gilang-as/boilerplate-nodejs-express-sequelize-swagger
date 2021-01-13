const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

module.exports  = ({db_name, db_user, db_pass, db_host, db_port, db_dialect, db_logging}) => {
    const db = {};
    const sequelize = new Sequelize(db_name, db_user, db_pass, {host: db_host, port:db_port, dialect: db_dialect, logging: db_logging});

    fs.readdirSync(__dirname).filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db
}