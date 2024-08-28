import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
} as ConfigOptions);

const checkFileExists = async (filename: string): Promise<string> => {
  let finalFilename = filename;
  let counter = 2;

  // Loop untuk mengecek apakah nama file sudah ada di Cloudinary
  while (true) {
    try {
      // Mencoba untuk mengambil file dari Cloudinary
      await cloudinary.api.resource(`uploads/${finalFilename}`);
      // Jika file ada, tambahkan penomoran
      finalFilename = `${filename}_${counter}`;
      counter++;
    } catch (error) {
      // Jika file tidak ada (error 404), keluar dari loop dan return finalFilename
      if ((error as any).http_code === 404) {
        return finalFilename;
      }
      // Abaikan error jika bukan 404 dan lanjutkan loop
      if ((error as any).http_code !== 404) {
        console.warn("Unexpected error:", error);
      }
      break;
    }
  }
  return finalFilename;
};


// Konfigurasi penyimpanan Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const originalFilename =
      req.body.filename || file.originalname.split(".")[0];
    const filename = await checkFileExists(originalFilename); // Panggil fungsi checkFileExists
    console.log("filename", filename);
    return {
      folder: "uploads",
      format: "png",
      public_id: filename,
      resource_type: "image",
    };
  },
});

export { cloudinary, storage };
