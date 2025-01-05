import express, { Application, NextFunction, Request, Response } from "express";
import { Server } from "http";
import SocketServer from "./socket";
import cors from "cors";
import DB from "../data-source";

export default class App {
  public app: Application = express();
  public db: DB;
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.server = new SocketServer(this.app).server;
    this.db = new DB();
    this.initMiddlewares();
    this.initRouters();
    this.notFoundRouter();
    this.handleUnCaughtException();
  }

  public async startServer() {
    await this.db.initializeDatabase();
    this.app.listen(this.port, () => {
      console.log(
        `TypeORM test server has been started successfully on port ${this.port}`
      );
    });
  }

  private initMiddlewares() {
    this.app.use([
      express.json(),
      express.urlencoded({ extended: true }),
      cors(),
    ]);
  }

  private initRouters() {
    this.app.get("/", (_, res: Response) => {
      res.send("Welcome!");
    });
    console.log("Routers has been initiated successfully");
  }

  private notFoundRouter() {
    this.app.use("*", (_, res: Response) => {
      res.status(404).send("Route Not Found!");
    });
  }

  private handleUnCaughtException() {
    this.app.use((err: Error, req: Request, res: Response) => {
      res.status(500).send("Internal server error. " + err.message);
    });
  }
}
