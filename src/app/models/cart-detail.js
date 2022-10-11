import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const CartDetail = sequelize.define('CartDetail', {
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
    // Other model options go here
});

export default CartDetail