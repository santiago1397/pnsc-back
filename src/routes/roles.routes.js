import { Router } from "express";
import {
    getRoles,
} from "../controllers/roles.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/roles", verifyToken, getRoles);
/* router.post("/schools", verifyToken, createSchool); */
/* router.put("/user/:id", verifyToken,  updateUser); */
/* router.delete("/category/:id", verifyToken, deleteCategory); */



export default router;