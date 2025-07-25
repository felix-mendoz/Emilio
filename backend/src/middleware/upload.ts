import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id_usuario = req.body.id_usuario;
    if (!id_usuario) return cb(new Error("ID de usuario requerido"), "");

    const safeUserId = path.basename(id_usuario); // Evita inyecciones de ruta
    const dir = path.join(__dirname, "..", "uploads", safeUserId);

    try {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (err) {
      cb(new Error("Error creando directorio del usuario"), "");
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// (Opcional) Filtro de tipo de archivo
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido'), false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter }); // Puedes omitir fileFilter si no lo necesitas
