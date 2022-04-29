const sequelize = require("../configs/sqlite");
const { DataTypes, Model } = require('sequelize');

class Order extends Model { }

Order.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        statusQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        arrived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        underscored: true,
        modelName: 'Order',
        freezeTableName: true
    }
)


sequelize.sync({alter: true}).then(() => {})


module.exports = Order