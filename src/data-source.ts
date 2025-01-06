import "reflect-metadata";
import { DataSource } from "typeorm";
import * as Entities from "./entity";

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
      synchronize: !["prod", "production"].includes(process.env.NODE_ENV || ""),
      logging: false,
      entities: [
        Entities.Photo,
        Entities.PhotoMetadata,
        Entities.Author,
        Entities.Album,
      ],
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

  getDataSource() {
    return this.AppDataSource;
  }
}

export const db = new DB();
