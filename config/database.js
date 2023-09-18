'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    operatorsAliases: 0,
    logging: true,
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      options: {
        encrypt: false,
      },
    },
    timezone:process.env.TIME_ZONE
  }
);
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to Database has been established successfuly');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
module.exports = { sequelize, DataTypes };
