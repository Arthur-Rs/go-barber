import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import Settings from '../settings/database';

// Models
import UserModel from '../app/models/UserModel';
import FileModel from '../app/models/FileModel';
import AppointmentsModel from '../app/models/AppointmentsModel';

const models = [UserModel, FileModel, AppointmentsModel];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(Settings);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associete && model.associete(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = Mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true,
      }
    );
  }
}

export default new Database();
