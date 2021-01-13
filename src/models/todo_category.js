const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class todo_category extends Model {
        static associate(models) {
            // define association here

        }
    };
    todo_category.init({
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        product_id: {
            unique: "compositeIndex",
            type: DataTypes.STRING,
            allowNull: false
        },
        product_code: {
            unique: "compositeIndex",
            type: DataTypes.STRING,
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        icon_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        display_priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'todo_category',
    });
    return todo_category;
};