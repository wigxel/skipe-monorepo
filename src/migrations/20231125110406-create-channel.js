'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'channels',
        {
          id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.STRING,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          slug: {
            type: Sequelize.STRING,
            allowNull: true,
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
      await queryInterface.dropTable('channels', { transaction });
    });
  },
};
