import { dbClient } from "./../server";
import express from "express";
import type { Request, Response } from "express";
// import formidable from "formidable";
import { partyroomForm, partyroomFormPromise } from "../formidable";
import { Partyroom } from "../model";
import { Equipment } from "../model";
import formidable from "formidable";

export const roomDetailsRoutes = express.Router();

roomDetailsRoutes.get("/:pid", getRoomDetails);
roomDetailsRoutes.put("/:pid", editRoomDetails);

// get details for one party room, used in partyrooms_details.js
async function getRoomDetails(req: Request, res: Response) {
  try {
    const roomId = +req.params.pid;
    if (isNaN(roomId)) {
      res.status(400).json({ message: "invalid room id" });
      return;
    }
    let partyroomQuery = await dbClient.query(/*SQL*/ `SELECT * FROM partyrooms WHERE id = $1`, [roomId]);
    let equipmentQuery = await dbClient.query(/*SQL*/ `SELECT * FROM equipments WHERE id = $1`, [roomId]);

    const resultQuery = partyroomQuery.rows[0];
    const equipment = equipmentQuery.rows[0];

    equipment["equipment_name"] = equipment["name"];
    delete equipment["name"];
    Object.assign(resultQuery, equipment);

    res.json(resultQuery);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}

// need to fix //
//edit party room
async function editRoomDetails(req: Request, res: Response) {
  const { fields, files } = await partyroomFormPromise(partyroomForm, req);

  const partyroomId = +req.params.pid;
  const newName = fields.name;
  const newPhone_no = fields.phone_no;
  const newPrice = parseInt(fields.price as string);
  const newVenue = fields.venue;
  const newStyle = fields.style;
  const newArea = parseInt(fields.area as string);
  const newCapacity = parseInt(fields.capacity as string);
  const new_equipment_name = fields.equipment_name;
  const newType = fields.type;
  const newIntro = fields.intro;
  if (isNaN(partyroomId)) {
    res.status(400).json({ message: "invalid partyroom id" });
    return;
  }

  let newImageFilename = (files.image as formidable.File | undefined)?.newFilename;

  if (!newImageFilename){
    await dbClient.query<Partyroom>(
      /*SQL*/ `UPDATE partyrooms SET name = $1, phone_no = $2, price = $3, venue = $4, style = $5, area = $6, capacity = $7, intro = $8 WHERE id = $9`,
      [
        newName,
        newPhone_no,
        newPrice,
        newVenue,
        newStyle,
        newArea,
        newCapacity,
        newIntro,
        partyroomId,
      ]
    );
  } else {
    await dbClient.query<Partyroom>(
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
        newImageFilename,
        partyroomId,
      ]
    );
  }

  
  // need to fix //
  await dbClient.query<Equipment>(/*SQL*/ `UPDATE equipments SET name = $1, type = $2 WHERE id = $3`, [
    new_equipment_name,
    newType,
    partyroomId,
  ]);

  res.json({ message: "party room updated" });
}
