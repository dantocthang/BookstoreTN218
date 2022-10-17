import {DataTypes} from 'sequelize'
import sequelize from '../../config/db.js';
import User from './User.js';

const Address = sequelize.define('Address', {
    name: {
        type: DataTypes.STRING,
    },
    address: { type: DataTypes.STRING },
    user_id: { type: DataTypes.INTEGER},
}, {
    // Other model options go here
});

export default Address