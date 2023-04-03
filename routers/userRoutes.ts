import express from "express";
import formidable from "formidable";
import { partyroomForm, partyroomFormPromise } from "../formidable";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { Booking } from "../model";
import { Partyroom } from "../model";
import { Equipment } from "../model";

export const userRoutes = express.Router();

userRoutes.delete("/upload/:pid", deleteRoom);
userRoutes.post("/booking/:pid", bookRoom);
userRoutes.get("/booking", getAllBookings);
userRoutes.post("/upload", uploadRoom);
userRoutes.get("/upload", allRooms);
userRoutes.post("/uploadEquipments", uploadEquipments);
userRoutes.get("/self", getUserID);
// userRoutes.get("/partyroomself", getPartyroomID)
userRoutes.get("/bookingself", getBookingSelf);

async function getBookingSelf(req: Request, res: Response) {
  const booking = (
    await dbClient.query(
      "SELECT start_at, finish_at from bookings WHERE user_id = $1",
      [req.session.user_id]
    )
  ).rows[0];
  res.json(booking);
}

// get user id //
async function getUserID(req: Request, res: Response) {
  const user = (
    await dbClient.query("SELECT id, name, phone_no FROM users WHERE id = $1", [
      req.session.user_id,
    ])
  ).rows[0];
  res.json(user);
}

// async function getPartyroomID(req: Request, res: Response) {
//   const partyroom = (await dbClient.query("SELECT id, name FROM partyrooms WHERE id = $1", [req.session.partyroom_id])).rows[0];
//   res.json(partyroom);
// }

// upload a party room //
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
    /*SQL*/ `INSERT INTO partyrooms (name, phone_no, price, venue, style,area,capacity,intro, imagefilename, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
    ]
  );
  const partyroomId = (
    await dbClient.query<Partyroom>(
      /*sql*/ `SELECT id, name FROM partyrooms WHERE name = $1`,
      [name]
    )
  ).rows[0];
  req.session.partyroom_id = partyroomId.id;
  console.log(req.session.partyroom_id);

  await dbClient.query<Equipment>(
    /*SQL*/ `INSERT INTO equipments (name, type) VALUES ($1, $2)`,
    [equipment_name, type]
  );
  res.json({ message: "party room uploaded" });
}

/* ---------------------------users get room information ---------------------------------------------- */
// some function here //

// show party room data from database //
async function allRooms(_req: Request, res: Response) {
  const queryResult = await dbClient.query<Partyroom>(
    "SELECT * FROM partyrooms"
  );
  res.json(queryResult.rows); // pass array into res.json()
}

//upload equipment//
async function uploadEquipments(req: Request, res: Response) {
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
}

// make a booking //
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

async function getAllBookings(req: Request, res: Response) {
  const queryResult = await dbClient.query<Booking>(
    `SELECT bookings.id AS id, name, venue, start_at, finish_at FROM bookings JOIN partyrooms ON bookings.partyroom_id = partyrooms.id WHERE bookings.user_id = $1;`,
    [req.session.user_id]
  );
  res.json(queryResult.rows);
}

// delete party room //
async function deleteRoom(req: Request, res: Response) {
  const partyroomId = +req.params.pid;
  if (isNaN(partyroomId)) {
    // httpStatusCodes.BAD_REQUEST
    res.status(400).json({ message: "invalid partyrooms id" });
    return;
  }

  await dbClient.query(/*SQL*/ `DELETE FROM partyrooms WHERE id = $1`, [
    partyroomId,
  ]);

  // need to fix
  await dbClient.query(/*SQL*/ `DELETE FROM equipments where id = $1`, [
    partyroomId,
  ]);

  res.json({ message: "party room deleted" });
}
