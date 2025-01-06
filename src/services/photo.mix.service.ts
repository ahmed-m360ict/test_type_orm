import { Request } from "express";
import { db } from "../data-source";
import { DataSource } from "typeorm";
import * as Entities from "../entity";

export default class PhotoMixService {
  protected dataSource: DataSource;
  protected ResMsg = {
    OK: "The request is okay",
    NOT_FOUND: "Data could not be found",
  };
  constructor() {
    this.dataSource = db.getDataSource();
  }

  ////////////
  // Photo //
  //////////

  // CREATE
  async insertPhoto(req: Request) {
    const { name, description, filename, isPublished } = req.body;

    const photo = new Entities.Photo();
    photo.name = name;
    photo.description = description;
    photo.filename = filename;
    photo.isPublished = isPublished;
    photo.views = 0;

    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    await photoRepo.save(photo);

    return {
      success: true,
      code: 201,
      message: "Photo has been saved",
      data: { id: photo.id },
    };
  }

  // UPDATE
  async updatePhoto(req: Request) {
    const id = Number(req.params.id);
    const { name, description, filename, isPublished } = req.body;

    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    const photo = await photoRepo.findOneBy({ id });
    if (!photo)
      return {
        success: false,
        code: 404,
        message: this.ResMsg.NOT_FOUND,
      };

    if (name) photo.name = name;
    if (description) photo.description = description;
    if (filename) photo.filename = filename;
    if (isPublished) photo.isPublished = isPublished;
    photo.updated_at = new Date();

    await photoRepo.save(photo);

    return {
      success: true,
      code: 201,
      message: "Photo has been saved",
      data: req.body,
    };
  }

  // DELETE
  async deletePhoto(req: Request) {
    const id = Number(req.params.id);
    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    const photo = await photoRepo.findOneBy({ id });
    if (!photo)
      return {
        success: false,
        code: 404,
        message: this.ResMsg.NOT_FOUND,
      };
    await photoRepo.delete({ id });
    return {
      success: true,
      code: 200,
      message: this.ResMsg.OK,
    };
  }

  // GET LIST
  async getPhotos(req: Request) {
    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    const [photos, count] = await photoRepo.findAndCount({
      select: { id: true, name: true, filename: true, views: true },
    });
    return {
      success: true,
      code: 200,
      message: this.ResMsg.OK,
      data: { photos, total: count },
    };
  }

  // GET SINGLE
  async getPhoto(req: Request) {
    const id = Number(req.params.id);
    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    const photo = await photoRepo.findOne({ where: { id } });
    if (!photo)
      return {
        success: false,
        code: 404,
        message: this.ResMsg.NOT_FOUND,
      };

    photo.views += 1;
    await photoRepo.save(photo);
    return {
      success: true,
      code: 200,
      message: this.ResMsg.OK,
      data: photo,
    };
  }
}
