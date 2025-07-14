import express from 'express';
import {getData, postData} from './src/controllers/controllers';
import {getArchivo, postArchivo} from './src/controllers/archivo.controller'
import { upload } from "./middleware/upload";

export const router = express.Router();

// Route to get data {GETS}
router.get("/data",getData);

// Route to post data {POSTS}
router.post("/data",postData);

router.get("/archivos", getArchivo); //aqui hay que poner el id del usuario billy tu te encargas
router.post("/archivos", upload.single("file"), postArchivo);

export default router;