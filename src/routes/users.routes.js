import { Router } from "express";
import {
  getUsers,
  updateUser,
  createUser,
  deleteUser
} from "../controllers/user.controller.js";

import {verifyToken} from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/user/:skip/:limit", verifyToken,  getUsers); 
router.put("/user/:id", verifyToken,  updateUser);
router.post("/user", verifyToken,  createUser);
router.delete("/user/:id", verifyToken,  deleteUser);



export default router;