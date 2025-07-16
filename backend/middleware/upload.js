const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id_usuario = req.body.id_usuario;
    if (!id_usuario) return cb(new Error("ID de usuario requerido"), "");

    const dir = path.join(__dirname, "..", "uploads", id_usuario);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });