'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Invoices', 'grandTotal', Sequelize.DOUBLE);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invoices', 'grandTotal');
  }
};
