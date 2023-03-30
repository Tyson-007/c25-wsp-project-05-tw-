import { dbClient } from "./../server";
import express from "express";
import type { Request, Response } from "express";

export const roomDetailsRoutes = express.Router();

roomDetailsRoutes.get("/:pid", getRoomDetails, geteqDetails);

async function getRoomDetails(req: Request, res: Response) {
  try {
    const roomId = +req.params.pid;
    if (isNaN(roomId)) {
      res.status(400).json({ message: "invalid room id" });
      return;
    }
    const resultQuery = await dbClient.query(
      /*SQL*/ `SELECT * FROM partyrooms WHERE id = $1`,
      [roomId]
    );
    res.json(resultQuery.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}

async function geteqDetails(req: Request, res: Response) {
  try {
    const equipmentId = +req.params.pid;
    if (isNaN(equipmentId)) {
      res.status(400).json({ message: "invalid room id" });
      return;
    }
    const resultQuery = await dbClient.query(
      /*SQL*/ `SELECT * FROM equipments WHERE id = $1`,
      [equipmentId]
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
