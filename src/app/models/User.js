import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.js';

const User = sequelize.define('User', {
    fullName: {
        type: DataTypes.STRING,
    },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    phone: { type: DataTypes.STRING(10)},
    googleId: { type: DataTypes.STRING },
    facebookId: { type: DataTypes.STRING },
    token: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    email_verified: { type: DataTypes.TINYINT}
}, {
    // Other model options go here
});

export default User