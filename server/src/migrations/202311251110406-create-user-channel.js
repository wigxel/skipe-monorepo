'use strict';

// channel_subscriptions  is known as the vendors subscribed channels
// if vendor a is interested in grocery and electronics, this is where we'll store his interest

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'channel_subscriptions',
        {
          id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.STRING,
          },
          userId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'user_id',
            references: {
              model: 'users',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          channelId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'channel_id',
            references: {
              model: 'channels',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
      await queryInterface.dropTable('channel_subscriptions', { transaction });
    });
  },
};
