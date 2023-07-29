'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Customers', {
      fields: ['countryId'],
      type: 'foreign key',
      name: 'customer_country_association',
      references: {
        table: 'Countries',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Customers', {
      fields: ['countryId'],
      type: 'foreign key',
      name: 'customer_country_association',
      references: {
        table: 'Countries',
        field: 'id'
      }
    })
  }
};
