// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_TYPE, DB_PORT, NODE_ENV, APP_NAME } = process.env;
module.exports = {
  appConfig: {
    NODE_ENV,
    APP_NAME,
  },
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_TYPE,
    port: DB_PORT,
    seederStorage: 'json',
    seederStoragePath: 'sequelizeSeedData.json',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_TYPE,
    port: DB_PORT,
    seederStorage: 'json',
    seederStoragePath: 'sequelizeSeedData.json',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_TYPE,
    port: DB_PORT,
    seederStorage: 'json',
    seederStoragePath: 'sequelizeSeedData.json',
  },
  staging: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_TYPE,
    port: DB_PORT,
    seederStorage: 'json',
    seederStoragePath: 'sequelizeSeedData.json',
  },
};
