import { Router } from "express";
import rtController from "../controllers/rtController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, rtController.getRts);
router.get("/:id", authMiddleware, rtController.getRtById);
router.post("/", authMiddleware, rtController.createRt);
router.put("/:id", authMiddleware, rtController.updateRt);
router.delete("/:id", authMiddleware, rtController.deleteRt);
router.get("/all/geojson", authMiddleware, rtController.getAllRtGeoJSON);

export default router;
