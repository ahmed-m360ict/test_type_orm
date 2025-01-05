import "reflect-metadata";
import { DataSource } from "typeorm";
import { Photo } from "./entity/Photo";

export default class DB {
  protected AppDataSource: DataSource;
  constructor() {
    this.AppDataSource = new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "asdfgh",
      database: "test_typeorm",
      synchronize: true,
      logging: false,
      entities: [Photo],
      migrations: [],
      subscribers: [],
    });
  }

  async initializeDatabase() {
    try {
      await this.AppDataSource.initialize();
      console.log("Database connection successful");
    } catch (error: any) {
      console.error(error);
      console.warn("Database connection failed.", error.message);
    }
  }
}
