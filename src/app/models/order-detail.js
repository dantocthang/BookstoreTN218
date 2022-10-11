import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const OrderDetail = sequelize.define('OrderDetail', {
    price: { type: DataTypes.INTEGER },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
    // Other model options go here
});

export default OrderDetail