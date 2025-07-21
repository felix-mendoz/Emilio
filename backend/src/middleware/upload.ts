import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id_usuario = req.body.id_usuario;
    if (!id_usuario) return cb(new Error("ID de usuario requerido"), "");

    const dir = path.join(__dirname, "..", "uploads", id_usuario);
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });