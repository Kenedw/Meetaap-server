import 'dotenv-flow/config';

import express from 'express';
import compression from 'compression';

import routes from '../routes';

import '../database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(compression());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
