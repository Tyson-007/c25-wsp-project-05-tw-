import express from "express";
import expressSession from "express-session";
import { Request, Response, NextFunction } from "express";
import jsonfile from "jsonfile";
import path from "path";

const app = express();
const USER_JSON_PATH = path.join(__dirname, "public", "data", "users.json");
// const UPLOAD_JSON_PATH = path.join(
//   __dirname,
//   "private",
//   "data",
//   "uploads.json"
// );

interface User {
  name: string;
  password: string;
}

// interface UploadData {
//   id: number;
//   ownerName: string;
//   phoneNum: number;
//   price: number;
//   area: number;
//   capacity: number;
//   style: string;
//   venue: string;
//   intro: string;
//   equipment: string;
//   image?: string;
// }

// const uploadDir = "uploads";
// fs.mkdirSync(uploadDir, { recursive: true });

// const form = formidable({
//   uploadDir,
//   keepExtensions: false,
//   maxFiles: 1,
//   maxFileSize: 1024 ** 2 * 200, // the default limit is 1KB * 200
//   filter: (part) => part.mimetype?.startsWith("image/") || false,
//   filename: (_originalName, _originalExt, part) => {
//     const fieldName = part.name;
//     const timestamp = Date.now();
//     const ext = part.mimetype?.split("/").pop();
//     return `${fieldName}-${timestamp}.${ext}`;
//   },
// });

// export function formParsePromise(form: IncomingForm, req: express.Request) {
//   return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
//     (resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     }
//   );
// }

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
    counter?: number;
    isLoggedIn?: boolean;
  }
}

////////////
// logger //
////////////
app.use((req: Request, res: Response, next: NextFunction) => {
  if (isNaN(req.session.counter!)) {
    req.session.counter = 0;
  } else {
    req.session.counter! += 1;
  }
  const datetime = new Date();
  console.log(
    `${req.session.id} (${req.session.counter}): [${datetime.getFullYear()}-${
      datetime.getMonth() + 1
    }-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}] Request ${
      req.url
    }`
  );
  next();
});

// Section xxx: Route Handlers
// import { authRoutes } from "./routers/authRoutes";
// import { userRoutes } from "./routers/memoRoutes";

/////////////////////////
// login route handler //
/////////////////////////
app.post("/login", async (req, res, next) => {
  const name: string = req.body.name;
  const password: string = req.body.password;

  if (!name || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const users: Array<User> = await jsonfile.readFile(USER_JSON_PATH);

  const foundUser = users.find(
    (u) => u.name === name && u.password === password
  );

  if (!foundUser) {
    res.status(400).json({ message: "invalid username or password" });
    return;
  }

  req.session.isLoggedIn = true;
  next();
});

app.use(express.static("public"));
const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
app.use(guardMiddleware, express.static("private"));

/* 
---------------------------------------------upload users data------------------------------------------------------------------------
 */

// import formidable from "formidable";
// import IncomingForm from "formidable/Formidable";
// import fs from "fs";

// app.post("/uploadData", async (req, res) => {
//   const { fields, files } = await formParsePromise(form, req);
//   //係formidable要加番formParsePromise呢個function

//   //upload info
//   const ownerName = fields.ownerName as string;
//   if (!ownerName) {
//     res.status(400).json({ message: "missing ownerName" });
//     return;
//   }

//   const phoneNum = parseInt(
//     Array.isArray(fields.phoneNum) ? fields.phoneNum[0] : fields.phoneNum
//   );
//   if (isNaN(phoneNum)) {
//     res.status(400).json({ message: "invalid phoneNum" });
//     return;
//   }

//   const price = parseFloat(
//     Array.isArray(fields.price) ? fields.price[0] : fields.price
//   );
//   if (isNaN(price)) {
//     res.status(400).json({ message: "invalid price" });
//     return;
//   }

//   const area = parseFloat(
//     Array.isArray(fields.area) ? fields.area[0] : fields.area
//   );
//   if (isNaN(area)) {
//     res.status(400).json({ message: "invalid area" });
//     return;
//   }

//   const capacity = parseInt(fields.capacity as string);
//   if (isNaN(capacity)) {
//     res.status(400).json({ message: "invalid capacity" });
//     return;
//   }

//   const style = fields.style as string;
//   if (!style) {
//     res.status(400).json({ message: "missing style" });
//     return;
//   }

//   const venue = fields.venue as string;
//   if (!venue) {
//     res.status(400).json({ message: "missing venue" });
//     return;
//   }

//   const intro = fields.intro as string;
//   if (!intro) {
//     res.status(400).json({ message: "missing intro" });
//     return;
//   }

//   const equipment = fields.equipment as string;
//   if (!equipment) {
//     res.status(400).json({ message: "missing equipment" });
//     return;
//   }

//   const imageFilename = (files.image as formidable.File | undefined)
//     ?.newFilename;

//   const uploadData: UploadData[] = jsonfile.readFileSync(UPLOAD_JSON_PATH);
//   uploadData.push({
//     id: uploadData.length + 1,
//     ownerName,
//     phoneNum,
//     price,
//     area,
//     capacity,
//     style,
//     venue,
//     intro,
//     equipment,
//     image: imageFilename,
//   });
//   jsonfile.writeFileSync(UPLOAD_JSON_PATH, uploadData, { spaces: 2 });

//   res.json({ message: "success" });
// });

// Section xxx: Error Handling
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
