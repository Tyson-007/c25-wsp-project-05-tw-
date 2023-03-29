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
    const resultQuery = await dbClient.query(/*SQL*/ `SELECT * FROM partyrooms WHERE id = $1`, [roomId]);
    res.json(resultQuery.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
