import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Review = sequelize.define('Review', {
    content: { type: DataTypes.STRING(500) },
    stars: { type: DataTypes.INTEGER }
}, {
    // Other model options go here
});

export default Review