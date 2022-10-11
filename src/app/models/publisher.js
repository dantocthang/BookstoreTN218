import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Publisher = sequelize.define('Publisher', {
    name: { type: DataTypes.STRING }
}, {
    // Other model options go here
});

export default Publisher