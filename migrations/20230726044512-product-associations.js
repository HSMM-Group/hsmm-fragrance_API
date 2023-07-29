'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Products', {
      fields: ['brandId'],
      type: 'foreign key',
      name: 'product_brand_association',
      references: {
        table: 'Brands',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Products', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'product_category_association',
      references: {
        table: 'Categories',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Products', {
      fields: ['currencyId'],
      type: 'foreign key',
      name: 'product_currency_association',
      references: {
        table: 'Currencies',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Products', {
      fields: ['stockId'],
      type: 'foreign key',
      name: 'product_stock_association',
      references: {
        table: 'Stocks',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Products', {
      fields: ['brandId'],
      type: 'foreign key',
      name: 'product_brand_association',
      references: {
        table: 'Brands',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('Products', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'product_category_association',
      references: {
        table: 'Categories',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('Products', {
      fields: ['currencyId'],
      type: 'foreign key',
      name: 'product_currency_association',
      references: {
        table: 'Currencies',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('Products', {
      fields: ['stockId'],
      type: 'foreign key',
      name: 'product_stock_association',
      references: {
        table: 'Stocks',
        field: 'id'
      }
    })
  }
};
