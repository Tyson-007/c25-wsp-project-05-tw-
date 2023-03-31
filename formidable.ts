import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import fs from "fs";
import express from "express";

// save uploaded image
const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

//formidable related setup
export const partyroomForm = formidable({
  uploadDir,
  keepExtensions: false,
  maxFiles: 1,
  maxFileSize: 1024 ** 2 * 200,
  filter: (part) => part.mimetype?.startsWith("image/") || false,
  filename: (_originalName, _originalExt, part) => {
    const fieldName = part.name;
    const timestamp = Date.now();
    const ext = part.mimetype?.split("/").pop();
    return `${fieldName}-${timestamp}.${ext}`;
  },
});

export function partyroomFormPromise(form: IncomingForm, req: express.Request) {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}
