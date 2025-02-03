import { Router } from "express";
import {
    getEntities,
    createEntity,
    editEntity
} from "../controllers/entity.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/entity/:skip/:limit", verifyToken, getEntities);
router.post("/entity", verifyToken, createEntity);
router.put("/entity/:id", verifyToken,  editEntity);
/* router.put("/user/:id", verifyToken,  updateUser); */
/* router.delete("/category/:id", verifyToken, deleteCategory); */



export default router;