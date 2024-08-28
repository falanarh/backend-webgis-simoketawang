import multer from 'multer';
import { storage } from '../config/cloudinary';

// Konfigurasi Multer dengan Cloudinary Storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1 MB dalam byte
  },
  fileFilter: (req, file, cb) => {
    // Hanya membolehkan file gambar
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('File must be an image') as any, false); // Casting ke any untuk menghindari error
    }
    cb(null, true);
  }
});

// Middleware error handler untuk Multer
const multerErrorHandler = (err : any, req : any, res : any, next : any) => {
  if (err) {
    // Menangani kesalahan dari fileFilter
    if (err.message === 'File too large') {
        return res.status(400).send({ error: "Ukuran gambar melebihi batas maksimal 1 MB." });
      }
    // Menangani kesalahan dari Multer, seperti ukuran file melebihi batas
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ error: err.message });
    }
    // Menangani kesalahan dari fileFilter
    if (err.message === 'File must be an image') {
      return res.status(400).send({ error: err.message });
    }
    // Kesalahan umum
    return res.status(500).send({ error: 'Terjadi kesalahan saat proses upload.' });
  }
  next();
};

export { upload, multerErrorHandler };
