import { Router } from "express";
import {
    getSchools,
    createSchool,
} from "../controllers/schools.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/schools", verifyToken, getSchools);
router.post("/schools", verifyToken, createSchool);
/* router.put("/user/:id", verifyToken,  updateUser); */
/* router.delete("/category/:id", verifyToken, deleteCategory); */



export default router;