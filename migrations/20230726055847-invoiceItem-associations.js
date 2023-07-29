'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('InvoiceItems', {
      fields: ['invoiceId'],
      type: 'foreign key',
      name: 'invoiceItem_invoice_association',
      references: {
        table: 'Invoices',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('InvoiceItems', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'invoiceItem_product_association',
      references: {
        table: 'Products',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('InvoiceItems', {
      fields: ['currencyId'],
      type: 'foreign key',
      name: 'invoiceItem_currency_association',
      references: {
        table: 'Currencies',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('InvoiceItems', {
      fields: ['invoiceId'],
      type: 'foreign key',
      name: 'invoiceItem_invoice_association',
      references: {
        table: 'Invoices',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('InvoiceItems', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'invoiceItem_product_association',
      references: {
        table: 'Products',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('InvoiceItems', {
      fields: ['currencyId'],
      type: 'foreign key',
      name: 'invoiceItem_currency_association',
      references: {
        table: 'Currencies',
        field: 'id'
      }
    })
  }
};
