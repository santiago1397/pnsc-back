import { Router } from "express";
/* import {
  getlocations,
  getPerson
} from "../controllers/others.controller.js"; */
import { getDpt } from "../controllers/dpt.controller.js";

const router = Router();


/* router.post("/dpt", getlocations);
router.post("/saime", getPerson); */
router.post("/mydpt", getDpt)



export default router;