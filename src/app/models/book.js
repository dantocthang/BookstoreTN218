import {DataTypes} from 'sequelize'
import sequelize from '../../config/db.js';

const Book = sequelize.define('Book', {
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    price: {type: DataTypes.INTEGER, defaultValue: 0},
    stock: {type: DataTypes.INTEGER, defaultValue: 0},
    year: {type: DataTypes.INTEGER, defaultValue: new Date().getFullYear()}
}, {
    // Other model options go here
});

export default Book