import { Request, Response } from 'express';

const uploadImage = (req: Request, res: Response): void => {
  try {
    // Periksa apakah req.file ada
    if (!req.file) {
      res.status(400).send({ error: 'Tidak ada file yang diunggah.' });
      return; // Tambahkan return di sini untuk memastikan fungsi berhenti setelah mengirim respons
    }

    // Jika ukuran file valid, kirimkan URL gambar
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).send({ error: 'Terjadi kesalahan saat proses upload.' });
  }
};

export { uploadImage };
