import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING}
}, {
    // Other model options go here
});

export default Category