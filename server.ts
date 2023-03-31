import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
dbClient.connect();

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    user_id: number;
  }
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "very secret",
    saveUninitialized: true,
    resave: true,
  })
);

import { roomDetailsRoutes } from "./routers/roomDetailsRoutes";
import { userRoutes } from "./routers/userRoutes";
import { authRoutes } from "./routers/authRoutes";

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/roomDetails", roomDetailsRoutes);

////////////////////
// express.static //
////////////////////
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

// port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
