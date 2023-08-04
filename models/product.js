'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: DataTypes.STRING,
    brandId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    stockId: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    currencyId: DataTypes.INTEGER,
    barcode: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    coverImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};