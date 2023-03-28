import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
// import jsonfile from "jsonfile";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import pg from "pg";
// import { checkPassword } from "./hash";

import dotenv from "dotenv";
dotenv.config();

const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
dbClient.connect();

const app = express();

export const USER_JSON_PATH = path.join(__dirname, "data", "users.json");
export const PARTYROOM_JSON_PATH = path.join(
  __dirname,
  "data",
  "partyrooms.json"
);

interface User {
  name: string;
  password: string;
}

interface Partyroom {
  id: number;
  name?: string;
  price?: number;
  venue: string;
  style?: string;
  area?: number;
  capacity?: number;
  intro?: string;
  imagefilename?: string;
}

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

const partyroomForm = formidable({
  uploadDir,
  keepExtensions: false,
  maxFiles: 1,
  maxFileSize: 1024 ** 2 * 200,
  filter: (part) => part.mimetype?.startsWith("image/") || false,
  filename: (_originalName, _originalExt, part) => {
    const fieldName = part.name;
    const timestamp = Date.now();
    const ext = part.mimetype?.split("/").pop();
    return `${fieldName}-${timestamp}.${ext}`;
  },
});

export function partyroomFormPromise(form: IncomingForm, req: express.Request) {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}

// Section xxx: Basic Middleware //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "very secret",
    saveUninitialized: true,
    resave: true,
  })
);

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
  }
}

// Section xxx: Route Handlers
// import { authRoutes } from "./routers/authRoutes";
// import { userRoutes } from "./routers/memoRoutes";

/////////////////////////
// login route handler //
/////////////////////////
app.post("/login", async (req, res) => {
  const name: string = req.body.name;
  const password: string = req.body.password;
  if (!name || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const queryResult = await dbClient.query<User>(
    /*SQL*/ `SELECT id, name, password, phone_no, date_of_birth, email FROM users WHERE name = $1 AND password = $2`,
    [name, password]
  );
  const foundUser = queryResult.rows[0];

  if (!foundUser) {
    res.status(400).json({ message: "invalid username or password" });
    return;
  }

  req.session.isLoggedIn = true;
  res.status(200).json({ message: "logged in" });
});

/////////////////////////
// user route handlers //
/////////////////////////

// upload a party room //
app.post("/upload", async (req, res) => {
  const { fields, files } = await partyroomFormPromise(partyroomForm, req);

  const name = fields.name as string;
  const price = parseInt(fields.price as string);
  const venue = fields.venue as string;
  const style = fields.style as string;
  const area = parseInt(fields.area as string);
  const capacity = parseInt(fields.capacity as string);
  const intro = fields.intro as string;

  if (!name || !price || !venue || !style || !area || !capacity || !intro) {
    res.status(400).json({ message: "missing content" });
    return;
  }

  const imageFilename = (files.image as formidable.File | undefined)
    ?.newFilename;

  await dbClient.query<Partyroom>(
    /*SQL*/ `INSERT INTO partyrooms (name, price, venue, style,area,capacity,intro, imagefilename) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [name, price, venue, style, area, capacity, intro, imageFilename]
  );
  res.json({ message: "party room uploaded" });
});

app.get("/upload", async (_req, res) => {
  const queryResult = await dbClient.query<Partyroom>(
    "SELECT * FROM partyrooms"
  );
  res.json(queryResult.rows); // pass array into res.json()
});

// express.static //
app.use(express.static("public"));
const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
app.use(guardMiddleware, express.static("private"));

// Section xxx: Error Handling
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
