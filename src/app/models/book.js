import {DataTypes} from 'sequelize'
import sequelize from '../../config/db.js';

const Book = sequelize.define('Book', {
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    price: {type: DataTypes.FLOAT},
    stock: {type: DataTypes.INTEGER},
    year: {type: DataTypes.INTEGER},
}, {
    // Other model options go here
});

export default Book