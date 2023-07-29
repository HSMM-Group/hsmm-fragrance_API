 'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Invoices', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'invoice_customer_association',
      references: {
        table: 'Customers',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Invoices', {
      fields: ['cashierId'],
      type: 'foreign key',
      name: 'invoice_employee_association',
      references: {
        table: 'Employees',
        field: 'id'
      }
    })
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Invoices', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'invoice_customer_association',
      references: {
        table: 'Customers',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('Invoices', {
      fields: ['cashierId'],
      type: 'foreign key',
      name: 'invoice_employee_association',
      references: {
        table: 'Employees',
        field: 'id'
      }
    })
  }
};
