import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import usahaKlengkengController from "../controllers/usahaKlengkengController";

const router = express.Router();

router.post("/", authMiddleware, usahaKlengkengController.addUsahaKlengkeng);
router.put("/:id", authMiddleware, usahaKlengkengController.updateUsahaKlengkeng);
router.delete("/:id", authMiddleware, usahaKlengkengController.deleteUsahaKlengkeng);
router.get("/:kode", authMiddleware, usahaKlengkengController.getUsahaKlengkengByKode);
router.get("/", usahaKlengkengController.getAllUsahaKlengkeng);

export default router;
