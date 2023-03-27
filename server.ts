import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
import jsonfile from "jsonfile";
import path from "path";

const app = express();
const USER_JSON_PATH = path.join(__dirname, "public", "data", "users.json");

interface User {
  name: string;
  password: string;
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
    isLoggedIn?: boolean;
  }
}

///////////////////////////
// counter route handler //
///////////////////////////
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

/////////////////////////
// login route handler //
/////////////////////////
app.post("/login", async (req, res, next) => {
  const name: string = req.body.name;
  const password: string = req.body.password;

  if (!name || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const users: Array<User> = await jsonfile.readFile(USER_JSON_PATH);

  const foundUser = users.find(
    (u) => u.name === name && u.password === password
  );

  if (!foundUser) {
    res.status(400).json({ message: "invalid username or password" });
    return;
  }

  req.session.isLoggedIn = true;
  next();
});

app.use(express.static("public"));
const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
app.use(guardMiddleware, express.static("private"));

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
