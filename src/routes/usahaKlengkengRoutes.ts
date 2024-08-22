import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import usahaKelengkengController from "../controllers/usahaKelengkengController";

const router = express.Router();

router.post("/", authMiddleware, usahaKelengkengController.addUsahaKlengkeng);
router.put("/:kode", authMiddleware, usahaKelengkengController.updateUsahaKlengkeng);
router.delete("/:kode", authMiddleware, usahaKelengkengController.deleteUsahaKlengkeng);
router.get("/:kode", authMiddleware, usahaKelengkengController.getUsahaKlengkengByKode);
router.get("/", usahaKelengkengController.getAllUsahaKlengkeng);

export default router;