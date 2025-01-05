// import { Request, Response } from "express";
// import express from "express";
// const app = express();
// const port = 3100;

import App from "./app/app";

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

const app = new App(3100);
app.startServer();

export default app.app;
