import pg from 'pg';
import { db } from './config.js';

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = new pg.Pool({
        user: db.user,
        password: db.password,
        host: db.host,
        port: db.port,
        database: db.database,
      });

      Database.instance.on('connect', () => console.log('DB connected'));
    }
  }

  getInstance() {
    return Database.instance;
  }
}

const database = new Database();
Object.freeze(database);

export default database.getInstance();
