import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const Transcation = sequelize.define('Transcation', {
    money: { type: DataTypes.INTEGER },
    note: { type: DataTypes.STRING },
    vnp_response_code: { type: DataTypes.STRING },
    code_vnpay: { type: DataTypes.STRING },
    code_bank: { type: DataTypes.STRING },
}, {
    // Other model options go here
});

export default Transcation