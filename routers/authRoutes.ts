// import express from "express";
// import jsonfile from "jsonfile";
// import path from "path";

// interface User {
//   name: string;
//   password: string;
// }

// const app = express();
// const USER_JSON_PATH = path.join(__dirname, "..", "data", "users.json");

// app.post("/login", async (req, res) => {
//   const name: string = req.body.username;
//   const password: string = req.body.password;

//   if (!name || !password) {
//     res.status(400).json({ message: "missing username or password" });
//     return;
//   }

//   const users: Array<User> = await jsonfile.readFile(USER_JSON_PATH);
//   const foundUser = users.find(
//     (u) => u.name === name && u.password === password
//   );
//   if (!foundUser) {
//     res.status(400).json({ message: "invalid username or password" });
//     return;
//   }

//   req.session.isLoggedIn = true;
//   res.json({ message: "login success" });
// });
