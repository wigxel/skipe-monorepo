'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.STRING,
          },
          firstname: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lastname: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          isVendor: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            field: 'is_vendor',
            defaultValue: false,
          },
          email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'deleted_at',
          },
          lastSeen: {
            allowNull: true,
            type: Sequelize.DATE,
            field: 'last_seen',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'created_at',
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'updated_at',
          },
        },
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('users', { transaction });
    });
  },
};
