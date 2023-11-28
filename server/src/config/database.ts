import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';
import { readdirSync, statSync } from 'fs';
import * as path from 'path';

interface DBConfig {
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  DB_HOST: string;
}

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env as unknown as DBConfig;

const sequelize = new Sequelize({
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  dialect: 'postgres',
  port: 5432,
});

//how do I know this is running from source or build to know where to look for modules
const modulesDir = path.resolve(__dirname, '../modules');

const models: any[] = [];
interface Models {
  [key: string]: any;
}

const modelsObject: Models = {};
importModels(modulesDir, models, modelsObject);
sequelize.addModels(models);
export const db = sequelize;
export default modelsObject;

function importModels(dir: string, models: any[], modelsObj: Models) {
  const files = readdirSync(dir);

  files.forEach(file => {
    //typescript runtime cases with tsnode
    if (file.endsWith('.model.ts')) {
      const modelPath = path.resolve(dir, file.slice(0, -3));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const model = require(modelPath).default;
      models.push(model);
      const fileName = path.basename(modelPath, '.model.ts');

      modelsObj[fileName] = model;
    }
    //javascript runtime cases
    else if (file.endsWith('.model.js')) {
      const modelPath = path.resolve(dir, file.slice(0, -3));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const model = require(modelPath).default;
      models.push(model);
      const fileName = path.basename(modelPath, '.model.js');

      modelsObj[fileName] = model;
    } else if (statSync(path.join(dir, file)).isDirectory()) {
      importModels(path.join(dir, file), models, modelsObj);
    }
  });
}

for (const name in modelsObject) {
  const model = modelsObject[name];
  module.exports[name] = model;
}
