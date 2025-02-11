import { Router } from "express";
import {
    deleteSchedule,
    getSchedules,
    createSchedule,
    generatePDF
} from "../controllers/schedule.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router();

router.get("/schedule/:skip/:limit", verifyToken, getSchedules);
/* router.put("/user/:id", verifyToken,  updateUser); */
router.post("/schedule", verifyToken, createSchedule);
router.delete("/schedule/:id", verifyToken, deleteSchedule);
router.get("/schedule/:entity", verifyToken, generatePDF);



export default router;