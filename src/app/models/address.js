import {DataTypes} from 'sequelize'
import sequelize from '../../config/db.js';
import User from './User.js';

const Address = sequelize.define('Address', {
    name: {
        type: DataTypes.STRING,
    },
    address: { type: DataTypes.STRING },
}, {
    // Other model options go here
});
Address.belongsTo(User, { foreignKey: 'user_id' });

export default Address