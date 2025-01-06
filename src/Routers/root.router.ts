import { Router } from "express";
import PhotoMixController from "../controllers/photo.mix.controller";

export default class RootRouter {
  public router = Router();
  protected controller = new PhotoMixController();
  constructor() {
    this.callRouter();
  }

  private callRouter() {
    this.router
      .route("/photos")
      .post(this.controller.insertPhoto)
      .get(this.controller.getPhotos);

    this.router
      .route("/photos/:id")
      .patch(this.controller.updatePhoto)
      .delete(this.controller.deletePhoto)
      .get(this.controller.getPhoto);
  }
}
