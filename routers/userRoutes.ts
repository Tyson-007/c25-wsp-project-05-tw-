import express from "express";
import formidable from "formidable";
import { partyroomForm, partyroomFormPromise } from "../formidable";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { Booking } from "../model";
import { Partyroom } from "../model";
import { Equipment } from "../model";

export const userRoutes = express.Router();

userRoutes.put("/upload/:pid", deleteRoom);
userRoutes.post("/booking/:pid", bookRoom);
userRoutes.get("/booking", getAllBookings);
userRoutes.post("/upload", uploadRoom);
userRoutes.get("/upload", allRooms);
userRoutes.get("/self", getUserID);
userRoutes.get("/rooms_others", getOthersRooms);
userRoutes.get("/rooms_self", getMyRooms);
// userRoutes.get("/partyroomself", getPartyroomID)
// userRoutes.get("/bookingself", getBookingSelf);
// userRoutes.post("/uploadEquipments", uploadEquipments);

// async function getBookingSelf(req: Request, res: Response) {
//   const booking = (await dbClient.query("SELECT * from bookings join users on bookings.user_id = users.id join partyrooms on bookings.partyroom_id = partyrooms.id where users.id = $1", [req.session.user_id])).rows;
//   res.json(booking);
// }

// get user id, used in users.js //
async function getUserID(req: Request, res: Response) {
  const user = (
    await dbClient.query("SELECT id, name, phone_no FROM users WHERE id = $1", [
      req.session.user_id,
    ])
  ).rows[0];
  res.json(user);
}

// async function getPartyroomID(req: Request, res: Response) {
//   const partyroom = (
//     await dbClient.query("SELECT id, name FROM partyrooms WHERE id = $1", [
//       req.session.partyroom_id,
//     ])
//   ).rows[0];
//   res.json(partyroom);
// }

// async function getPartyroomID(req: Request, res: Response) {
//   const partyroom = (await dbClient.query("SELECT id, name FROM partyrooms WHERE id = $1", [req.session.partyroom_id])).rows[0];
//   res.json(partyroom);
// }

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
async function allRooms(_req: Request, res: Response) {
  const queryResult = await dbClient.query<Partyroom>(
    "SELECT * FROM partyrooms"
  );
  res.json(queryResult.rows); // pass array into res.json()
}

// make a booking, used in partyrooms_details.js //
async function bookRoom(req: Request, res: Response) {
  const start_at = req.body.start_at;
  const finish_at = req.body.finish_at;
  const participants = req.body.participants;
  const special_req = req.body.special_req;
  const partyroom_id = req.params.pid;

  if (!participants) {
    res.status(400).json({ missing: "missing required fields" });
    return;
  }

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
  res.status(200).json({ message: "booking successful" });
}

// get user's booking info, used in mybookings.js
async function getAllBookings(req: Request, res: Response) {
  const queryResult = await dbClient.query<Booking>(
    `SELECT bookings.id AS id, name, venue, start_at, finish_at FROM bookings JOIN partyrooms ON bookings.partyroom_id = partyrooms.id WHERE bookings.user_id = $1;`,
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

// get other's party rooms, used in users.js //
async function getOthersRooms(req: Request, res: Response) {
  const queryResult = await dbClient.query(
    /*SQL*/ `SELECT * from partyrooms WHERE user_id <> $1`,
    [req.session.user_id]
  );
  res.json(queryResult.rows);
}

// get my party rooms, used in users.js //
async function getMyRooms(req: Request, res: Response) {
  const queryResult = await dbClient.query(
    /*SQL*/ `SELECT * from partyrooms WHERE user_id = $1`,
    [req.session.user_id]
  );
  res.json(queryResult.rows);
}
