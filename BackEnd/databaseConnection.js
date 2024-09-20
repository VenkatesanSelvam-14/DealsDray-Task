const { Sequelize } = require("sequelize")
const env = require('dotenv');
env.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});
(async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('database connected successfully');
  }
  catch (err) {
    console.log(err);
  }
})();

module.exports = sequelize;