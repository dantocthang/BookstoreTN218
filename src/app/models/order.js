import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Order = sequelize.define('Order', {
    total: { type: DataTypes.INTEGER, defaultValue: 0 },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
    paymentMethod: { type: DataTypes.STRING },
    transactionId: { type: DataTypes.STRING },
    transdate: { type: DataTypes.STRING }
}, {
    // Other model options go here
});

export default Order