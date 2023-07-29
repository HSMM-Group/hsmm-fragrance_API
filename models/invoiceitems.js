'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvoiceItems.init({
    invoiceId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    currencyId: DataTypes.INTEGER,
    rate: DataTypes.DOUBLE,
    qty: DataTypes.INTEGER,
    isFree: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvoiceItems',
  });
  return InvoiceItems;
};