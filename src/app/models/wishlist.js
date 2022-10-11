import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Wishlist = sequelize.define('Wishlist', {

}, {
    // Other model options go here
});

export default Wishlist