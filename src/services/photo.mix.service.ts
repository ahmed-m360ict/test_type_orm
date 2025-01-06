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

    const metaData = new Entities.PhotoMetadata();
    metaData.orientation = "landscape";
    metaData.width = 1920;
    metaData.height = 1080;
    metaData.compressed = false;
    metaData.comment = "";
    metaData.photo = photo;

    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    const metaDataRepo = this.dataSource.getRepository(Entities.PhotoMetadata);
    await photoRepo.save(photo);
    await metaDataRepo.save(metaData);

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
    const photoMetaRepo = this.dataSource.getRepository(Entities.PhotoMetadata);
    const photo = await photoRepo.findOneBy({ id });
    if (!photo)
      return {
        success: false,
        code: 404,
        message: this.ResMsg.NOT_FOUND,
      };

    const metaData = await photoMetaRepo.findOneBy({ photo });

    if (name) photo.name = name;
    if (description) photo.description = description;
    if (filename) photo.filename = filename;
    if (isPublished) photo.isPublished = isPublished;
    photo.updated_at = new Date();

    // if need to fetch after modifying photo
    // const metaData = await photoMetaRepo.findOneBy({
    //   photo: { id: photo.id },
    // });

    if (metaData) {
      metaData.comment += " (updated)";
      // ...update other props if needed
      photo.metadata = metaData;
    }

    // TEMP ALBUM
    // const album1 = new Entities.Album();
    // album1.name = name;
    // const album2 = new Entities.Album();
    // album2.name = name;
    // const albumRepo = this.dataSource.getRepository(Entities.Album);
    // await albumRepo.save(album1);
    // await albumRepo.save(album2);
    // photo.albums = [album1, album2];

    await photoRepo.save(photo);

    return {
      success: true,
      code: 201,
      message: "Photo has been updated",
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
      relations: { metadata: true },
      select: {
        id: true,
        name: true,
        filename: true,
        views: true,
        metadata: { comment: true },
      },
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
    const photo = await photoRepo.findOne({
      where: { id },
      relations: { metadata: true, albums: true },
    });
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

  ////////////
  // Album //
  //////////

  // CREATE
  async insertAlbum(req: Request) {
    const { name } = req.body;
    const album = new Entities.Album();
    album.name = name;

    const albumRepo = this.dataSource.getRepository(Entities.Album);
    await albumRepo.save(album);

    return {
      success: true,
      code: 201,
      message: "Album has been created",
      data: { id: album.id },
    };
  }

  ////////////////////
  // Photo & Album //
  //////////////////

  // add photo to album
  async addPhotoToAlbum(req: Request) {
    const { photo_id, album_id, inverse } = req.body as {
      photo_id: number;
      album_id: number;
      inverse?: boolean;
    };

    const photoRepo = this.dataSource.getRepository(Entities.Photo);
    const albumRepo = this.dataSource.getRepository(Entities.Album);

    const [photo, album] = await Promise.all([
      photoRepo.findOne({
        where: { id: photo_id },
        relations: { albums: true },
      }),
      albumRepo.findOneBy({ id: album_id }),
    ]);

    if (!photo || !album)
      return {
        success: false,
        code: 404,
        message: "Photo or Album not found",
      };

    if (inverse) { console.log("before", photo.albums);
      if (!photo.albums.map((album) => album.id).includes(album.id))
        return {
          success: false,
          code: 409,
          message: "Photo is not in the album",
        };
      photo.albums = photo.albums.filter((alb) => alb.id !== album.id);
      console.log("after", photo.albums);
    } else {
      if (photo.albums.map((album) => album.id).includes(album.id))
        return {
          success: false,
          code: 409,
          message: "Photo already in the album",
        };

      photo.albums.push(album);
    }
    await photoRepo.save(photo);

    return {
      success: true,
      code: 201,
      message: `Photo ${inverse ? "removed from" : "added to"} the album`,
    };
  }
}
