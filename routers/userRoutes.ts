import express from "express";
import formidable from "formidable";
import { partyroomForm, partyroomFormPromise } from "../formidable";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { Booking } from "../model";
import { Partyroom } from "../model";
import { Equipment } from "../model";
import { Rating } from "../model";

export const userRoutes = express.Router();

userRoutes.put("/upload/:pid", deleteRoom);
userRoutes.post("/booking/:pid", bookRoom);
userRoutes.get("/booking", getAllBookings);
userRoutes.post("/upload", uploadRoom);
userRoutes.get("/upload", allRooms);
userRoutes.get("/self", getUserID);
userRoutes.get("/rooms_others", getOthersRooms);
userRoutes.get("/rooms_self", getMyRooms);
userRoutes.post("/rating/:pid", postComment);
userRoutes.get("/rating/:pid", getUserIDNoSession);
userRoutes.get("/search", searchRooms);
userRoutes.put("/user_info", updateUserInfo);
// userRoutes.post("rating/:pid", postRating)

// get user id, used in users.js //
async function getUserID(req: Request, res: Response) {
  const user = (
    await dbClient.query("SELECT id, name, phone_no FROM users WHERE id = $1", [
      req.session.user_id,
    ])
  ).rows[0];
  res.json(user);
}
//get user id no session
async function getUserIDNoSession(req: Request, res: Response) {
  // const partyroom_id = +req.params.pid;
  const user2 = (
    await dbClient.query(
      "SELECT users.name, comments, ratings FROM users JOIN ratings ON users.id = ratings.user_id join partyrooms on partyrooms.id = ratings.partyroom_id"
    )
  ).rows;
  res.json(user2);
}

// upload a party room, used in postData.js //
async function uploadRoom(req: Request, res: Response) {
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
  const is_hidden = false as boolean;
  // const user_id = parseInt(fields.user_id as string);

  if (
    !name ||
    !phone_no ||
    !price ||
    !venue ||
    !style ||
    !area ||
    !capacity ||
    !intro
    // !user_id
  ) {
    res.status(400).json({ message: "missing content" });
    return;
  }

  const imageFilename = (files.image as formidable.File | undefined)
    ?.newFilename;

  await dbClient.query<Partyroom>(
    /*SQL*/ `INSERT INTO partyrooms (name, phone_no, price, venue, style,area,capacity,intro, imagefilename, user_id, is_hidden) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      name,
      phone_no,
      price,
      venue,
      style,
      area,
      capacity,
      intro,
      imageFilename,
      req.session.user_id,
      is_hidden,
    ]
  );

  await dbClient.query<Equipment>(
    /*SQL*/ `INSERT INTO equipments (name, type) VALUES ($1, $2)`,
    [equipment_name, type]
  );
  res.json({ message: "party room uploaded" });
}

// show party room data from database, used in users.js //
async function allRooms(req: Request, res: Response) {
  const queryResult = await dbClient.query<Partyroom>(
    "SELECT * FROM partyrooms"
  );
  req.session.user_viewmode = "all";
  res.json(queryResult.rows); // pass array into res.json()
}

// make a booking, used in partyrooms_details.js //
async function bookRoom(req: Request, res: Response) {
  const start_at = req.body.start_at;
  const finish_at = req.body.finish_at;
  const participants = req.body.participants;
  const special_req = req.body.special_req;
  const partyroom_id = +req.params.pid;

  // if (!participants) {
  //   res.status(400).json({ missing: "missing required fields" });
  //   return;
  // }

  const queryResult = /*SQL*/ `INSERT INTO bookings (user_id, partyroom_id, start_at, finish_at, participants, special_req) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  await dbClient.query<Booking>(queryResult, [
    req.session.user_id,
    partyroom_id,
    start_at,
    finish_at,
    participants,
    special_req,
  ]);
  // console.log(queryResult.rows[0]);
  // console.log(req.session.user_id);
  console.log(req.body);

  res.status(200).json({ message: "booking successful" });
}

// get user's booking info, used in mybookings.js
async function getAllBookings(req: Request, res: Response) {
  const queryResult = await dbClient.query<Booking>(
    `SELECT bookings.id AS id, name, venue, start_at, finish_at, is_cancelled FROM bookings JOIN partyrooms ON bookings.partyroom_id = partyrooms.id WHERE bookings.user_id = $1;`,
    [req.session.user_id]
  );

  res.json(queryResult.rows);
}

// delete party room, used in users.js //
async function deleteRoom(req: Request, res: Response) {
  const partyroomId = +req.params.pid;
  if (isNaN(partyroomId)) {
    res.status(400).json({ message: "invalid partyrooms id" });
    return;
  }

  await dbClient.query(
    /*SQL*/ `UPDATE partyrooms SET is_hidden = true WHERE id = $1`,
    [partyroomId]
  );

  res.json({ message: "party room deleted" });
}

/* Comment, use in partyroom_details.js */
async function postComment(req: Request, res: Response) {
  const ratings = req.body.ratings;
  const comments = req.body.comments;
  const partyroom_id = +req.params.pid;

  if (ratings != req.body.ratings) {
    res.status(400).json({ message: "Please give a score" });
    return;
  }

  const queryResult = /*SQL*/ `INSERT INTO ratings (user_id, partyroom_id, ratings, comments) VALUES ($1, $2, $3, $4) RETURNING id`;
  await dbClient.query<Rating>(queryResult, [
    req.session.user_id,
    partyroom_id,
    ratings,
    comments,
  ]);

  // console.log(queryResult.rows[0]);
  res.status(200).json({ message: "submit rating successful" });
}

// async function postRating(req:Request, res: Response){

// }

// get other's party rooms, used in users.js //
async function getOthersRooms(req: Request, res: Response) {
  const queryResult = await dbClient.query(
    /*SQL*/ `SELECT * from partyrooms WHERE user_id <> $1`,
    [req.session.user_id]
  );
  req.session.user_viewmode = "others";
  res.json(queryResult.rows);
}

// get my party rooms, used in users.js //
async function getMyRooms(req: Request, res: Response) {
  const queryResult = await dbClient.query(
    /*SQL*/ `SELECT * from partyrooms WHERE user_id = $1`,
    [req.session.user_id]
  );
  req.session.user_viewmode = "own";
  res.json(queryResult.rows);
}

async function searchRooms(req: Request, res: Response) {
  if (req.session.user_viewmode === "own") {
    const queryResult = await dbClient.query(
      /*SQL*/ `SELECT partyrooms.id AS id, partyrooms.name AS name, user_id, phone_no, price, venue, style, area, capacity, intro, equipments.name AS equipment_name, type, imagefilename FROM partyrooms JOIN equipments ON partyrooms.id = equipments.partyroom_id WHERE partyrooms.user_id = $1;`,
      [req.session.user_id]
    );
    res.json(queryResult.rows);
    // console.log("own partyrooms data scraped");
  } else if (req.session.user_viewmode === "others") {
    const queryResult = await dbClient.query(
      /*SQL*/ `SELECT partyrooms.id AS id, partyrooms.name AS name, user_id, phone_no, price, venue, style, area, capacity, intro, equipments.name AS equipment_name, type, imagefilename FROM partyrooms JOIN equipments ON partyrooms.id = equipments.partyroom_id WHERE partyrooms.user_id <> $1;`,
      [req.session.user_id]
    );
    res.json(queryResult.rows);
    // console.log("others partyrooms data scraped");
  } else if (!req.session.user_id || req.session.user_viewmode === "all") {
    const queryResult = await dbClient.query(
      /*SQL*/ `SELECT partyrooms.id AS id, partyrooms.name AS name, user_id, phone_no, price, venue, style, area, capacity, intro, equipments.name AS equipment_name, type, imagefilename FROM partyrooms JOIN equipments ON partyrooms.id = equipments.partyroom_id;`
    );
    res.json(queryResult.rows);
    // console.log("all partyrooms data scraped");
  }
}
async function updateUserInfo(req: Request, res: Response) {
  const user_id = req.session.user_id;
  const newEmail = req.body.email;
  const newPhone_no = req.body.phone_no;
  const newDate_of_birth = req.body.date_of_birth;
  await dbClient.query(
    /*SQL*/ `UPDATE users SET email = $1, phone_no = $2, date_of_birth = $3 WHERE id = $4`,
    [newEmail, newPhone_no, newDate_of_birth, user_id]
  );

  res.json({ message: "user info updated" });
}
