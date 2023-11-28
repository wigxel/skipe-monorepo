import express, { Express } from 'express';
import 'reflect-metadata';
import './config/database';
import cors from 'cors';
import routes from './routes';
import ExbLogger from './common/logger';

const app: Express = express();
app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));

ExbLogger();
routes(app);

export default app;
