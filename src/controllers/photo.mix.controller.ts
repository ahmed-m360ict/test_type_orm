import { Request, Response } from "express";
import PhotoMixService from "../services/photo.mix.service";

export default class PhotoMixController {
  private services = new PhotoMixService();
  constructor() {
    this.insertPhoto = this.insertPhoto.bind(this);
    this.updatePhoto = this.updatePhoto.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.getPhoto = this.getPhoto.bind(this);
  }

  public async insertPhoto(req: Request, res: Response) {
    const { code, ...rest } = await this.services.insertPhoto(req);
    res.status(code).json(rest);
  }

  public async updatePhoto(req: Request, res: Response) {
    const { code, ...rest } = await this.services.updatePhoto(req);
    res.status(code).json(rest);
  }

  public async deletePhoto(req: Request, res: Response) {
    const { code, ...rest } = await this.services.deletePhoto(req);
    res.status(code).json(rest);
  }

  public async getPhotos(req: Request, res: Response) {
    const { code, ...rest } = await this.services.getPhotos(req);
    res.status(code).json(rest);
  }

  public async getPhoto(req: Request, res: Response) {
    const { code, ...rest } = await this.services.getPhoto(req);
    res.status(code).json(rest);
  }
}
