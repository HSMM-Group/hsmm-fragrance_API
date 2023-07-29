'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice.init({
    invoiceNo: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    cashAmount: DataTypes.DOUBLE,
    bankAmount: DataTypes.DOUBLE,
    cardAmount: DataTypes.DOUBLE,
    discountPercent: DataTypes.DOUBLE,
    discountAmount: DataTypes.DOUBLE,
    vat: DataTypes.DOUBLE,
    cashierId: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};