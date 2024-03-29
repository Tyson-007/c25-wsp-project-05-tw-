import express from "express";
import { User } from "../model";
import { hashPassword } from "../hash";
import { dbClient } from "../server";
import { Request, Response } from "express";
import { checkPassword } from "../hash";
// import { log } from "console";

export const authRoutes = express.Router();
authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.get("/login", getAllUsers);
authRoutes.delete("/logout", logout);

// login, used in index.js //
async function login(req: Request, res: Response) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      res.status(400).json({ message: "missing username or password" });
      return;
    }
    const foundUser = (
      await dbClient.query<User>(
        /*sql*/ `SELECT id, name, password FROM users WHERE name = $1`,
        [name]
      )
    ).rows[0];
    if (!foundUser) {
      res.status(400).json({ message: "invalid username or password" });
      return;
    }
    if (!(await checkPassword(password, foundUser.password))) {
      res.status(400).json({ message: "invalid password" });
      return;
    }

    req.session.isLoggedIn = true;
    req.session.user_id = foundUser.id;
    req.session.user_viewmode = "all";
    res.json({ message: "login success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

// signup, used in login.js //
async function signup(req: Request, res: Response) {
  try {
    const { name, password, password_check, phone_no, date_of_birth, email } =
      req.body;
    if (password != password_check) {
      res.status(401).json({ message: "passwords do not match" });
      return;
    }
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
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

//try get user info
async function getAllUsers(req: Request, res: Response) {
  const queryResult = await dbClient.query<User>("SELECT * FROM users");
  res.json(queryResult.rows);
}

// logout, used in every js except for index.js
async function logout(req: Request, res: Response) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) res.status(400).send("logout failed");
    });
    res.status(200).json({ message: "logged out" });
  } else {
    res.status(200).json({ message: "logged out" });
  }
}
