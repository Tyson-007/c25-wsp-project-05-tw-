import { dbClient } from "./../server";
import express from "express";
import type { Request, Response } from "express";
// import formidable from "formidable";
// import { partyroomForm, partyroomFormPromise } from "../formidable";
// import { Partyroom } from "../model";
// import { Equipment } from "../model";

export const bookingDetailsRoutes = express.Router();

bookingDetailsRoutes.get("/:pid", getBookingDetails);

// get details for one party room
async function getBookingDetails(req: Request, res: Response) {
  try {
    const bookingId = +req.params.pid;
    if (isNaN(bookingId)) {
      res.status(400).json({ message: "invalid room id" });
      return;
    }
    let resultQuery = (await dbClient.query(/*SQL*/ `SELECT * FROM bookings WHERE id = $1`, [bookingId])).rows[0];
    res.json(resultQuery);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
