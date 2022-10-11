import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Author = sequelize.define('Author', {
    name: { type: DataTypes.STRING},
    description: { type: DataTypes.STRING}
}, {
    // Other model options go here
});

export default Author