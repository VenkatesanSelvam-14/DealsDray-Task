const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConnection');

const Login = sequelize.define('Login', {
  f_sno: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  f_userName: {
    type: DataTypes.STRING(500),
    unique: true,
    allowNull: false
  },
  f_Pwd: {
    type: DataTypes.STRING(5000),
    allowNull: false
  }
}, {
  tableName: 't_login',
  timestamps: true
});

module.exports = Login;
