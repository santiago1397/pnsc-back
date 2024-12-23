import { Router } from "express";
import {
    deleteSchedule,
    getSchedules,
    createSchedule
} from "../controllers/schedule.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router();

router.get("/schedule/:skip/:limit", verifyToken, getSchedules);
/* router.put("/user/:id", verifyToken,  updateUser); */
router.post("/schedule", verifyToken, createSchedule);
router.delete("/schedule/:id", verifyToken, deleteSchedule);



export default router;