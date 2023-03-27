import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  expressSession({
    secret: "very secret",
    saveUninitialized: true,
    resave: true,
  })
);

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
  }
}

// Section xxx: Route Handlers
import { authRoutes } from "./routers/authRoutes";
import { userRoutes } from "./routers/memoRoutes";

app.use(express.static("public"));


// Section xxx: Error Handling
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
