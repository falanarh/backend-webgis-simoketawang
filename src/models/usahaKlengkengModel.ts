import mongoose, { Document, Schema } from "mongoose";

interface IUsahaKlengkeng extends Document {
  kode: string;
  kodeSls: string;
  rt_rw_dusun: string;
  nama_kepala_keluarga: string;
  alamat: string;
  latitude: string;
  longitude: string;
  jml_pohon: number;
  jml_pohon_new_crystal: number;
  jml_pohon_pingpong: number;
  jml_pohon_metalada: number;
  jml_pohon_diamond_river: number;
  jml_pohon_merah: number;
  jenis_pupuk: ("organik" | "anorganik" | "tidak_ada_pupuk")[];
  volume_produksi: number;
  pemanfaatan_produk: (
    | "kopi_biji_klengkeng"
    | "kerajinan_tangan"
    | "batik_ecoprint"
    | "minuman"
    | "makanan"
    | "tidak_dimanfaatkan"
  )[];
  catatan: string;
  url_img: string;
}

const UsahaKlengkengSchema = new Schema<IUsahaKlengkeng>({
  kode: { type: String },
  kodeSls: { type: String, required: true },
  rt_rw_dusun: { type: String, required: true },
  nama_kepala_keluarga: { type: String, required: true },
  alamat: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  jml_pohon: { type: Number, required: true },
  jml_pohon_new_crystal: { type: Number, required: true },
  jml_pohon_pingpong: { type: Number, required: true },
  jml_pohon_metalada: { type: Number, required: true },
  jml_pohon_diamond_river: { type: Number, required: true },
  jml_pohon_merah: { type: Number, required: true },
  jenis_pupuk: {
    type: [String],
    enum: ["organik", "anorganik", "tidak_ada_pupuk"],
    required: true,
  },
  volume_produksi: { type: Number, required: true },
  pemanfaatan_produk: {
    type: [String],
    enum: [
      "kopi_biji_klengkeng",
      "kerajinan_tangan",
      "batik_ecoprint",
      "minuman",
      "makanan",
      "tidak_dimanfaatkan",
    ],
    required: true,
  },
  catatan: { type: String },
  url_img: { type: String },
});

// UsahaKlengkengSchema.index({ kode: 1 }, { unique: true });

export { IUsahaKlengkeng };
export default mongoose.model<IUsahaKlengkeng>(
  "UsahaKlengkeng",
  UsahaKlengkengSchema
);
