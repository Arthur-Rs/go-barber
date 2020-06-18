import express from 'express';
import { resolve } from 'path';
import routes from '../routes';
import '../database';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      '/upload',
      express.static(resolve(__dirname, '..', '..', 'temp', 'upload'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
