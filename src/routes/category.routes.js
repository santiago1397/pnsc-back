import { Router } from "express";
import {
    createCategory,
    getCategories,
    deleteCategory
} from "../controllers/category.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/category/:skip/:limit", verifyToken, getCategories);
/* router.put("/user/:id", verifyToken,  updateUser); */
router.post("/category", verifyToken, createCategory);
router.delete("/category/:id", verifyToken, deleteCategory); 



export default router;