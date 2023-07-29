'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('UserMenus', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'userMenu_user_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('UserMenus', {
      fields: ['menuId'],
      type: 'foreign key',
      name: 'userMenu_menu_association',
      references: {
        table: 'Menus',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserMenus', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'userMenu_user_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    })
    await queryInterface.removeConstraint('UserMenus', {
      fields: ['menuId'],
      type: 'foreign key',
      name: 'userMenu_menu_association',
      references: {
        table: 'Menus',
        field: 'id'
      }
    })
  }
};
