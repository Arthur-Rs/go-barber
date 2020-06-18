import Sequelize from 'sequelize';
import Settings from '../settings/database';

// Models
import UserModel from '../app/models/UserModel';
import FileModel from '../app/models/FileModel';

const models = [UserModel, FileModel];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(Settings);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associete && model.associete(this.connection.models)
      );
  }
}

export default new Database();
