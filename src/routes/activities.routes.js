import { Router } from "express";
import {
    getActivities,
    createActivity,
    deleteActivity,
    editActivity
} from "../controllers/activities.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/activities/:skip/:limit", verifyToken, getActivities);
router.post("/activities", verifyToken, createActivity);
router.delete("/activities/:id", verifyToken, deleteActivity);
router.put("/activities/:id", verifyToken,  editActivity);



export default router;