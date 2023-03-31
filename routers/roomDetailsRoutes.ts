import { dbClient } from "./../server";
import express from "express";
import type { Request, Response } from "express";

export const roomDetailsRoutes = express.Router();

roomDetailsRoutes.get("/:pid", getRoomDetails);

async function getRoomDetails(req: Request, res: Response) {
  try {
    const roomId = +req.params.pid;
    if (isNaN(roomId)) {
      res.status(400).json({ message: "invalid room id" });
      return;
    }
    let partyroomQuery = await dbClient.query(
      /*SQL*/ `SELECT * FROM partyrooms WHERE id = $1`,
      [roomId]
    );
    let equipmentQuery = await dbClient.query(
      /*SQL*/ `SELECT * FROM equipments WHERE id = $1`,
      [roomId]
    );

    const resultQuery = partyroomQuery.rows[0];
    const equipment = equipmentQuery.rows[0];

    Object.assign(equipment, { equipment_name: equipment.name })["name"];
    Object.assign(resultQuery, equipment);

    res.json(resultQuery);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
