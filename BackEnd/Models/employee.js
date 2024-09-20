const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConnection');

const Employee = sequelize.define('Employee', {
  f_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  f_image: {
    type: DataTypes.BLOB('long'),  
    allowNull: true
  },
  f_Name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  f_Email: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    unique: true
  },
  f_Mobile: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  f_Designation: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  f_gender: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  f_Course: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  f_CreateDate: {
    type: DataTypes.DATEONLY,  
    allowNull: false
  }
}, {
  tableName: 't_Employee',
  timestamps: true
});

module.exports = Employee;
