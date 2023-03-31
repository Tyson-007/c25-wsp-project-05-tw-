import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
// import jsonfile from "jsonfile";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import pg from "pg";
import { hashPassword } from "./hash";
import { checkPassword } from "./hash";

import dotenv from "dotenv";
dotenv.config();

export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
dbClient.connect();

const app = express();

// const USER_JSON_PATH = path.join(__dirname, "data", "users.json");

// export const USER_JSON_PATH = path.join(__dirname, "data", "users.json");

export const USER_JSON_PATH = path.join(__dirname, "data", "users.json");
// const PARTYROOM_JSON_PATH = path.join(__dirname, "data", "partyrooms.json");
export const PARTYROOM_JSON_PATH = path.join(
  __dirname,
  "data",
  "partyrooms.json"
);

// Data type
interface User {
  name: string;
  password: string;
  phone_no?: number;
  date_of_birth?: Date;
  email?: string;
}

interface Booking {
  start_at?: Date;
  finish_at?: Date;
  participants?: number;
  special_req?: string;
}

interface Partyroom {
  id: number;
  name?: string;
  phone_no?: number;
  price?: number;
  venue: string;
  style?: string;
  area?: number;
  capacity?: number;
  intro?: string;
  imagefilename?: string;
}

interface Equipment {
  name: string;
  type: string;
}

// save uploaded image
const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

//formidable related setup
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

// Basic Middleware
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
// auth route handlers //
/////////////////////////

// signup // TO BE TESTED
app.post("/signup", async (req, res) => {
  const name: string = req.body.name;
  const password: string = req.body.password;
  const phone_no: number = req.body.phone_no;
  const date_of_birth: Date = req.body.date_of_birth;
  const email: string = req.body.email;

  if (!name || !password || !phone_no || !email) {
    res.status(400).json({ missing: "missing required fields" });
    return;
  }

  const queryResult = /*SQL*/ `INSERT INTO users (name, password, phone_no, date_of_birth, email) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  const hashed = await hashPassword(password);
  await dbClient.query<User>(queryResult, [
    name,
    hashed,
    phone_no,
    date_of_birth,
    email,
  ]);
  // console.log(queryResult.rows[0]);
  res.status(200).json({ message: "signup successful" });
});

// login //
app.post("/login", async (req, res) => {
  const name: string = req.body.name;
  const password: string = req.body.password;
  if (!name || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const queryResult = await dbClient.query<User>(
    /*SQL*/ `SELECT id, name, password, phone_no, date_of_birth, email FROM users WHERE name = $1`,
    [name]
  );
  const foundUser = queryResult.rows[0];

  if (!foundUser) {
    res.status(400).json({ message: "invalid username or password" });
    return;
  }

  if (!(await checkPassword(password, foundUser.password))) {
    res.status(400).json({ message: "invalid username or password" });
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
  const phone_no = fields.phone_no as string;
  const price = parseInt(fields.price as string);
  const venue = fields.venue as string;
  const style = fields.style as string;
  const area = parseInt(fields.area as string);
  const capacity = parseInt(fields.capacity as string);
  const equipment_name = fields.equipment_name as string;
  const type = fields.type as string;
  const intro = fields.intro as string;

  if (
    !name ||
    !phone_no ||
    !price ||
    !venue ||
    !style ||
    !area ||
    !capacity ||
    !intro
  ) {
    res.status(400).json({ message: "missing content" });
    return;
  }

  const imageFilename = (files.image as formidable.File | undefined)
    ?.newFilename;

  await dbClient.query<Partyroom>(
    /*SQL*/ `INSERT INTO partyrooms (name, phone_no, price, venue, style,area,capacity,intro, imagefilename) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [name, phone_no, price, venue, style, area, capacity, intro, imageFilename]
  );

  await dbClient.query<Equipment>(
    /*SQL*/ `INSERT INTO equipments (name, type) VALUES ($1, $2)`,
    [equipment_name, type]
  );

  res.json({ message: "party room uploaded" });
});

// booking
app.post("/booking", async (req, res) => {
  const start_at = req.body.start_at
  const finish_at = req.body.finish_at;
  const participants = req.body.participants
  const special_req= req.body.special_req

  if (!participants) {
    res.status(400).json({ missing: "missing required fields" });
    return;
  }

  const queryResult = /*SQL*/ `INSERT INTO bookings (start_at, finish_at, participants, special_req) VALUES ($1, $2, $3, $4) RETURNING id`;
  await dbClient.query<Booking>(queryResult, [start_at, finish_at, participants, special_req]);
  // console.log(queryResult.rows[0]);
  res.status(200).json({ message: "booking successful" });
});

// show party room data from database

app.get("/upload", async (_req, res) => {
  const queryResult = await dbClient.query<Partyroom>(
    "SELECT * FROM partyrooms"
  );
  res.json(queryResult.rows); // pass array into res.json()
});

//try get user info
app.get("/login", async (req, res) => {
  const queryResult = await dbClient.query<User>("SELECT * FROM users");
  res.json(queryResult.rows);
});

//edit party room
app.put("/upload/:pid", async (req, res) => {
  const partyroomId = +req.params.pid;
  const newName = req.body.name;
  const newPhone_no = req.body.phone_no;
  const newPrice = req.body.price;
  const newVenue = req.body.venue;
  const newStyle = req.body.style;
  const newArea = req.body.area;
  const newCapacity = req.body.capacity;
  const newIntro = req.body.intro;
  const newImageFileName = req.body.image;

  if (isNaN(partyroomId)) {
    res.status(400).json({ message: "invalid partyroom id" });
    return;
  }

  await dbClient.query(
    /*SQL*/ `UPDATE partyrooms SET name = $1, phone_no = $2, price = $3, venue = $4, style = $5, area = $6, capacity = $7, intro = $8, imagefilename = $9 WHERE id = $10`,
    [
      newName,
      newPhone_no,
      newPrice,
      newVenue,
      newStyle,
      newArea,
      newCapacity,
      newIntro,
      newImageFileName,
      partyroomId,
    ]
  );
  res.json({ message: "success" });
});

// delete party room
app.delete("/upload/:pid", async (req, res) => {
  const partyroomId = +req.params.pid;
  if (isNaN(partyroomId)) {
    // httpStatusCodes.BAD_REQUEST
    res.status(400).json({ message: "invalid partyrooms id" });
    return;
  }

  await dbClient.query(/*SQL*/ `DELETE FROM partyrooms WHERE id = $1`, [
    partyroomId,
  ]);
  res.json({ message: "success" });
});

//upload equipment//
app.post("/uploadEquipments", async (req, res) => {
  const switchGame: string = req.body.switchGame;
  const psGame: string = req.body.psGame;
  const otherEquipments: string = req.body.otherEquipments;

  if (!switchGame || !psGame || !otherEquipments) {
    res.status(400).json({ missing: "missing equipments" });
    return;
  }
  const queryResult = await dbClient.query<Equipment>(
    /*SQL*/ `INSERT INTO equipments`
  );
  console.log(queryResult.rows[0]);
});

// Get detalis from specific partyroom

import { roomDetailsRoutes } from "./routers/roomDetailsRoutes";
app.use("/roomDetails", roomDetailsRoutes);

// express.static //
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "uploads")));
const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(guardMiddleware, express.static("private"));

// Error Handling
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
