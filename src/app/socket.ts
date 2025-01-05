import { Application } from "express";
import http from "http";
import { Server } from "socket.io";
export let io: Server;

const origin = ["http://localhost:3100"];

export const SocketServer0 = (app: Application) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: { origin: origin },
  });

  return server;
};

export default class SocketServer {
  readonly server: http.Server;
  constructor(app: Application) {
    this.server = http.createServer(app);
    io = new Server(this.server, {
      cors: { origin: origin },
    });
  }
}
