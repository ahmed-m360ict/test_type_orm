import { Router } from "express";

export default class RootRouter {
  public router = Router();
  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // this.router.route("/photo")
  }
}
