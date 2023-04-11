// setup pg client

import pg from "pg";
import dotenv from "dotenv";
import { hashPassword } from "./hash";
import { Equipment, Partyroom, User } from "./model";
dotenv.config();

export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

async function insertUser(
  name: string,
  phone_no: string,
  date_of_birth: Date,
  email: string
) {
  const queryResult = /*SQL*/ `INSERT INTO users (name, password, phone_no, date_of_birth, email) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  const hashed = await hashPassword("123456");
  await dbClient.query<User>(queryResult, [
    name,
    hashed,
    phone_no,
    date_of_birth,
    email,
  ]);
}

async function insertPartyRoom(
  inputOne: Omit<Partyroom, "id">,
  inputTwo: Omit<Equipment, "partyroom_id" | "id">
) {
  let result = await dbClient.query<Partyroom>(
    /*SQL*/ `INSERT INTO partyrooms (name, phone_no, price, venue, style,area,capacity,intro, imagefilename, user_id, is_hidden) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id`,
    [
      inputOne.name,
      inputOne.phone_no,
      inputOne.price,
      inputOne.venue,
      inputOne.style,
      inputOne.area,
      inputOne.capacity,
      inputOne.intro,
      inputOne.imagefilename,
      inputOne.user_id,
      inputOne.is_hidden,
    ]
  );
  let partyroom_id = result.rows[0].id;
  console.log("check check", partyroom_id);
  await dbClient.query<Equipment>(
    /*SQL*/ `INSERT INTO equipments (name, type,partyroom_id) VALUES ($1, $2,$3)`,
    [inputTwo.name, inputTwo.type, partyroom_id]
  );
}

async function main() {
  await dbClient.connect();
  // insert dummy user
  await insertUser("test_user1", "999", new Date(), "test_user1@gmail.com");
  await insertUser("test_user2", "888", new Date(), "test_user1@gmail.com");
  await insertUser("test_user3", "777", new Date(), "test_user1@gmail.com");
  // insert dummy party room
  await insertPartyRoom(
    {
      name: "PartyRM 1",
      phone_no: "11111111",
      price: 100,
      venue: "TML A",
      style: "cyberpunk",
      area: 2000,
      capacity: 50,
      intro: "Let's code",
      imagefilename: "image-1680831253341.jpeg",
      user_id: 1,
      is_hidden: false,
    },
    { name: "PS5", type: "game" }
  );
  // insert dummy equipment

  // insert dummy booking

  await dbClient.end();
  console.log("====== Database with dummy data initialized ======");
}

main();
