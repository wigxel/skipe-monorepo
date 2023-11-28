'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

const hashPassword = bcrypt.hashSync('password', 10);
const users = [
  {
    id: 'clpez5t8n000008jx37bxfy3y',
    firstname: 'Stevy',
    lastname: 'Benoix',
    email: 'user1@mail.com',
    password: hashPassword,
    is_vendor: false,
    last_seen: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'clpez6mks000208jxhye1d7nm',
    firstname: 'Tomasina',
    lastname: 'Millan',
    email: 'user2@mail.com',
    password: hashPassword,
    is_vendor: false,
    last_seen: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'clpez6wiu000308jx9d3f0lkv',
    firstname: 'Tomasina',
    lastname: 'Millan',
    email: 'vendor@mail.com',
    is_vendor: true,
    password: hashPassword,
    last_seen: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.bulkInsert('users', users, { transaction });
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.bulkDelete('users', null, { transaction });
    });
  },
};
