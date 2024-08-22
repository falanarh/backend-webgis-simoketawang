import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import slsController from "../controllers/slsController";

const router = Router();

router.get("/", authMiddleware, slsController.getSls);
router.get("/:kode", authMiddleware, slsController.getSlsByKode);
router.post("/", authMiddleware, slsController.createSls);
router.put("/:kode", authMiddleware, slsController.updateSls);
router.delete("/:kode", authMiddleware, slsController.deleteSls);
router.get("/all/geojson", slsController.getAllSlsGeoJSON);
router.get("/all/aggregate", slsController.getAllAgregateSlsProperties);

export default router;
