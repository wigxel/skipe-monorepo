'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'product_requests',
        {
          id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.STRING,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          imageUrl: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'image_url',
          },
          userId: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'user_id',
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
      await queryInterface.dropTable('product_requests', { transaction });
    });
  },
};
