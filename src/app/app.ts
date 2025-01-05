import express, { Application, NextFunction, Request, Response } from "express";
import { Server } from "http";
import SocketServer from "./socket";
import cors from "cors";
import { db } from "../data-source";
import RootRouter from "../Routers/root.router";

export default class App {
  public app: Application = express();
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.server = new SocketServer(this.app).server;
    this.initMiddlewares();
    this.initRouters();
    this.notFoundRouter();
    this.handleUnCaughtException();
  }

  public async startServer() {
    await db.initializeDatabase();
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
    this.app.use("/api/v1", new RootRouter().router);
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
