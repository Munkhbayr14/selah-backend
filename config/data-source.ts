import 'dotenv/config';
import { DataSource } from 'typeorm';
import CONSTANTS from '../src/common/constants/constants.const';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: CONSTANTS.entities,
    migrations: ['src/database/migrations/*.ts'], // CLI үед ts файлууд
});
