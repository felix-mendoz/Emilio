import express from 'express';
import {getData, postData} from './src/controllers/controllers';

export const router = express.Router();

// Route to get data {GETS}
router.get("/data",getData);

// Route to post data {POSTS}
router.post("/data",postData);

export default router;