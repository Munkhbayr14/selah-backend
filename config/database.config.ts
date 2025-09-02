import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import CONSTANTS from '../src/common/constants/constants.const';

const CONNECTION_TYPE = 'postgres';
export const MAIN_DB_CONNECTION = 'default';

@Injectable()
export default class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: MAIN_DB_CONNECTION,
      type: CONNECTION_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      logging: process.env.ENVIRONMENT !== process.env.ENVIRONMENT_PROD,
      entities: CONSTANTS.entities,
      migrations: ['dist/src/database/migrations/*.js'],
      migrationsRun: false,
    };
  }
}
