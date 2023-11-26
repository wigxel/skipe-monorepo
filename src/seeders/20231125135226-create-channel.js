'use strict';
const users = [
  {
    id: 'clpez99vm000408jxfxk5hpge',
    name: 'Grocery',
    slug: 'grocery',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'clpez9hvr000508jxe2cih3ga',
    name: 'Electronics',
    slug: 'electronics',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.bulkInsert('channels', users, { transaction });
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.bulkDelete('channels', null, { transaction });
    });
  },
};
