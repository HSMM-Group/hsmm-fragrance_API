'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Employees', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'employee_user_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Employees', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'employee_user_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    })
  }
};
