import express from "express";
import rumahTanggaController from "../controllers/rumahTanggaController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, rumahTanggaController.addRumahTangga);
router.put("/:id", authMiddleware, rumahTanggaController.updateRumahTangga);
router.delete("/:id", authMiddleware, rumahTanggaController.deleteRumahTangga);
router.get("/:id", authMiddleware, rumahTanggaController.getRumahTanggaById);
router.get("/", authMiddleware, rumahTanggaController.getAllRumahTangga);

export default router;