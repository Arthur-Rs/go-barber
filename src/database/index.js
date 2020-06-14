import Sequelize from 'sequelize';
import Settings from '../settings/database';

// Models
import UserModel from '../app/models/UserModel';

const models = [UserModel];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(Settings);

    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
