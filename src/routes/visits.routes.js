import { Router } from "express";
import {
    getVisits,
    createVisit,
} from "../controllers/visits.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/visits/:skip/:limit", verifyToken, getVisits);
router.post("/visits", verifyToken, createVisit);
/* router.put("/user/:id", verifyToken, updateUser); */
/* router.delete("/user/:id", verifyToken, deleteUser); */



export default router;