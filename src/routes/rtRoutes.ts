import { Router } from "express";
import rtController from "../controllers/rtController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, rtController.getRts);
router.get("/:kode", authMiddleware, rtController.getRtByKode);
router.post("/", authMiddleware, rtController.createRt);
router.put("/:kode", authMiddleware, rtController.updateRt);
router.delete("/:kode", authMiddleware, rtController.deleteRt);
router.get("/all/geojson", authMiddleware, rtController.getAllRtGeoJSON);

export default router;
