import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Image = sequelize.define('Image', {
    path: { type: DataTypes.STRING }
}, {
    // Other model options go here
});

export default Image