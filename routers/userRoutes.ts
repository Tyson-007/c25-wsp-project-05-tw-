import express from "express";
import formidable from "formidable";
import { partyroomForm, partyroomFormPromise } from "../formidable";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { Booking } from "../model";
import { Partyroom } from "../model";
import { Equipment } from "../model";

export const userRoutes = express.Router();

userRoutes.put("/upload/:pid", editRoom);
userRoutes.delete("/upload/:pid", deleteRoom);
userRoutes.post("/booking", bookRoom);
userRoutes.post("/upload", uploadRoom);
userRoutes.get("/upload", allRooms);
userRoutes.post("/uploadEquipments", uploadEquipments);
userRoutes.get("/self", async (req, res) => {
  const user = (
    await dbClient.query("SELECT id, name FROM users WHERE id = $1", [
      req.session.user_id,
    ])
  ).rows[0];
  res.json(user);
});

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

  if (!participants) {
    res.status(400).json({ missing: "missing required fields" });
    return;
  }

  const queryResult = /*SQL*/ `INSERT INTO bookings (start_at, finish_at, participants, special_req) VALUES ($1, $2, $3, $4) RETURNING id`;
  await dbClient.query<Booking>(queryResult, [
    start_at,
    finish_at,
    participants,
    special_req,
  ]);
  // console.log(queryResult.rows[0]);
  res.status(200).json({ message: "booking successful" });
}

//edit party room
async function editRoom(req: Request, res: Response) {
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
  res.json({ message: "success" });
}
