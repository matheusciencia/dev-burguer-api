import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.cjs';
import User from '../app/models/User.js';
import Product from '../app/models/Products.js';

const models = [User, Product];

class Database {
  constructor() {
    this.init();
  }

  init() {
    console.log('Initializing database connection...');
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
