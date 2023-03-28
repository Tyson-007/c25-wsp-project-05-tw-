/* 
1. 要開多個新HTML for入users data (done)
2. formidable link to new HTML page 
3. only for party room information
 */
import express from "express";
import path from "path";
import jsonfile from "jsonfile";
import formidable from "formidable";

userRoutes.post("/users", uploadInfo); //upload owners data
// userRoutes.get("/users", getAllInfo); //users get party room info
// userRoutes.put("/users:mid", updateInfo); //change room info
// userRoutes.delete("/users:mid", deleteInfo); //del room info

/* ---------------------------upload room information ---------------------------------------------- */
//以下內容都要再改
async function uploadInfo(req: Request, res: Response) {
  const { fields, files } = await formParsePromise(form, req);
  //係formidable要加番formParsePromise呢個function

  //upload info
  const ownerName = fields.ownerName as string;
  if (!ownerName) {
    res.status(400).json({ message: "missing ownerName" });
    return;
  }

  const phoneNum = fields.phoneNum as number;
  if (!phoneNum) {
    res.status(400).json({ message: "missing phoneNum" });
    return;
  }

  const price = fields.price as number;
  if (!price) {
    res.status(400).json({ message: "missing price" });
    return;
  }

  const area = fields.area as number;
  if (!area) {
    res.status(400).json({ message: "missing area" });
    return;
  }

  const price = fields.price as number;
  if (!price) {
    res.status(400).json({ message: "missing price" });
    return;
  }

  const capacity = fields.capacity as number;
  if (!capacity) {
    res.status(400).json({ message: "missing capacity" });
    return;
  }

  const style = fields.style as string;
  if (!style) {
    res.status(400).json({ message: "missing style" });
    return;
  }

  const venue = fields.venue as number;
  if (!venue) {
    res.status(400).json({ message: "missing venue" });
    return;
  }

  const intro = fields.intro as string;
  if (!intro) {
    res.status(400).json({ message: "missing intro" });
    return;
  }

  const equipment = fields.equipment as string;
  if (!equipment) {
    res.status(400).json({ message: "missing equipment" });
    return;
  }

  //upload photo
  // const imageFilename = (files.image as formidable.File | undefined)
  //   ?.newFilename;

  // const memos: Memo[] = jsonfile.readFileSync(MEMO_JSON_PATH);
  // memos.push({
  //   id: memos.length + 1,
  //   content,
  //   image: imageFilename,
  //   is_active: true,
  // });
  // jsonfile.writeFileSync(MEMO_JSON_PATH, memos, { spaces: 2 });

  // res.json({ message: "success" });
}

/* ---------------------------users get room information ---------------------------------------------- */

/* ---------------------------update room information ---------------------------------------------- */

/* ---------------------------delete room information ---------------------------------------------- */

// const app = express();

// const PORT = 8080;

// app.get("/", (_req, res) => {
//   res.json({ message: "hello" });
// });

// app.use(express.static(path.join(__dirname, "private")));

// app.listen(PORT, () => {
//   console.log(`listening to http://localhost:${PORT}`);
// });
