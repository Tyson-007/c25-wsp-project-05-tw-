import { dbClient } from "./../server";
import express from "express";
import type { Request, Response } from "express";

// import formidable from "formidable";
// import { partyroomForm, partyroomFormPromise } from "../formidable";
// import { Partyroom } from "../model";
// import { Equipment } from "../model";

export const bookingDetailsRoutes = express.Router();

bookingDetailsRoutes.get("/:bid", getBookingDetails);
bookingDetailsRoutes.delete("/:bid", deleteBooking);

// get details for one booking, used in booked.js
async function getBookingDetails(req: Request, res: Response) {
  try {
    const bookingId = +req.params.bid;

    // if (isNaN(bookingId)) {
    //   res.status(400).json({ message: "invalid booking id" });
    //   return;
    // }

    let resultQuery = (
      await dbClient.query(
        /*SQL*/ `SELECT bookings.id, users.name AS owner, partyrooms.name AS room_name, start_at, finish_at, participants, special_req, venue, partyrooms.phone_no AS phone_no, imagefilename FROM bookings INNER JOIN partyrooms ON bookings.partyroom_id = partyrooms.id INNER JOIN users ON partyrooms.user_id = users.id WHERE bookings.id = $1`,
        [bookingId]
      )
    ).rows[0];

    res.json(resultQuery);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}

// delete booking (using is_cancelled boolean)
async function deleteBooking(req: Request, res: Response) {
  const bookingId = +req.params.bid;

  if (isNaN(bookingId)) {
    res.status(400).json({ message: "invalid booking id" });
    return;
  }

  await dbClient.query(
    /*SQL*/ `DELETE from bookings WHERE id = $1`,[bookingId]
  );

  res.json({ message: "booking cancelled" });
}