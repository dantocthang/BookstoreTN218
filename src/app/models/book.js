import {DataTypes} from 'sequelize'
import sequelize from '../../config/db.js';

const Book = sequelize.define('Book', {
    name: {type: DataTypes.STRING}
}, {
    // Other model options go here
});

export default Book