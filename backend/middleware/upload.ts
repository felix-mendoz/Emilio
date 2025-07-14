// middlewares/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const idUsuario = req.body.id_usuario;

    if (!idUsuario) return cb(new Error("ID de usuario requerido"), "");

    const uploadPath = path.join(__dirname, "..", "uploads", idUsuario);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });