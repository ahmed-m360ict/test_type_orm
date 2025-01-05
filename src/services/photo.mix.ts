import { Request } from "express";
import { db } from "../data-source";
import { DataSource } from "typeorm";

export default class PhotoMixService {
  protected dataSource: DataSource;
  constructor() {
    this.dataSource = db.getDataSource();
  }

  ////////////
  // Photo //
  //////////

  // CREATE
  async insertPhoto(req: Request) {}
}
