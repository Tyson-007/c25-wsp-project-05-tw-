import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();

app.use(
  expressSession({
    secret: "gufyeahjkfuiahgvaenrfa",
    saveUninitialized: true,
    resave: true,
  })
);

declare module "express-session" {
  interface SessionData {
    counter?: number;
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (isNaN(req.session.counter!)) {
    req.session.counter = 0;
  } else {
    req.session.counter! += 1;
  }
  const datetime = new Date();
  console.log(
    `${req.session.id} (${req.session.counter}): [${datetime.getFullYear()}-${
      datetime.getMonth() + 1
    }-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}] Request ${
      req.url
    }`
  );
  next();
});

app.use(express.static("publiccopy"));

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "publicccopy", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
