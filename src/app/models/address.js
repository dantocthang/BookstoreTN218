import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Address = sequelize.define('Address', {
    name: { type: DataTypes.STRING, defaultValue: 'new profile' },
    address: { type: DataTypes.STRING }
}, {
    // Other model options go here
});

export default Address