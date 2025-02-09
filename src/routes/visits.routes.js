import { Router } from "express";
import {
    getVisits,
    createVisit,
    validateStudents,
    getVisitReport,
    deleteVisit
} from "../controllers/visits.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/visits/:skip/:limit", verifyToken, getVisits);
router.post("/visits", verifyToken, createVisit);
router.post("/visits/verify", verifyToken, validateStudents);
router.get("/visits/visit/:entity/:id", verifyToken, getVisitReport);
router.delete("/visits/:id", verifyToken, deleteVisit);



export default router;