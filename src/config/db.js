import { Sequelize } from 'sequelize'
const sequelize = new Sequelize('bookstoretn218', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});


 
export default sequelize