// setup pg client

import pg from "pg";
import dotenv from "dotenv";
import { hashPassword } from "./hash";
import { User } from "./model";
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

async function main() {
  await dbClient.connect();
  // insert dummy user
  await insertUser("test_user1", "999", new Date(), "test_user1@gmail.com");
  await insertUser("test_user2", "888", new Date(), "test_user1@gmail.com");
  await insertUser("test_user2", "777", new Date(), "test_user1@gmail.com");
  // insert dummy party room

  // insert dummy equipment

  // insert dummy booking

  await dbClient.end();
  console.log("====== Database with dummy data initialized ======");
}

main();
