import { Router } from "express";
import {
    getVisits,
    createVisit,
} from "../controllers/visits.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/user", verifyToken, getVisits);
router.post("/user", verifyToken, createVisit);
/* router.put("/user/:id", verifyToken, updateUser); */
/* router.delete("/user/:id", verifyToken, deleteUser); */



export default router;