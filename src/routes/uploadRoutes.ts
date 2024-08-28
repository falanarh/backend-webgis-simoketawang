import { Router } from 'express';
import { upload, multerErrorHandler } from '../services/uploadService';
import { uploadImage } from '../controllers/uploadController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Endpoint untuk upload gambar
router.post('/upload', authMiddleware, upload.single('image'), multerErrorHandler, uploadImage);

export default router;
