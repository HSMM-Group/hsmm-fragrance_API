'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoiceNo: {
        type: Sequelize.STRING
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      cashAmount: {
        type: Sequelize.DOUBLE
      },
      bankAmount: {
        type: Sequelize.DOUBLE
      },
      cardAmount: {
        type: Sequelize.DOUBLE
      },
      discountPercent: {
        type: Sequelize.DOUBLE
      },
      discountAmount: {
        type: Sequelize.DOUBLE
      },
      tax: {
        type: Sequelize.DOUBLE
      },
      taxAmount: {
        type: Sequelize.DOUBLE
      },
      totalAmount: {
        type: Sequelize.DOUBLE
      },
      changeAmount:{
        type: Sequelize.DOUBLE
      },
      saleNote: {
        type: Sequelize.STRING
      },
      cashierId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      cancelBy: {
        type: Sequelize.INTEGER
      },
      cancelNote: {
        type: Sequelize.STRING
      },
      closeSale:{
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  }
};