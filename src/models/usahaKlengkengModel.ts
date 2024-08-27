import mongoose, { Document, Schema } from "mongoose";

interface IUsahaKlengkeng extends Document {
  kode: string;
  kodeSls: string;
  rt_rw_dusun: string;
  nama_kepala_keluarga: string;
  alamat: string;
  latitude: string;
  longitude: string;
  jenis_klengkeng:
    | "new_crystal"
    | "pingpong"
    | "matalada"
    | "diamond_river"
    | "merah";
  usia_pohon: number;
  jenis_pupuk: "organik" | "anorganik" | "tidak_ada_pupuk";
  frekuensi_berbuah: number;
  rata2_volume_produksi_per_panen: number;
  pemanfaatan_produk: (
    | "kopi_biji_klengkeng"
    | "kerajinan_tangan"
    | "batik_ecoprint"
    | "minuman"
    | "makanan"
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
  jenis_klengkeng: {
    type: String,
    enum: ["new_crystal", "pingpong", "matalada", "diamond_river", "merah"],
    required: true,
  },
  usia_pohon: { type: Number, required: true },
  jenis_pupuk: {
    type: String,
    enum: ["organik", "anorganik", "tidak_ada_pupuk"],
    required: true,
  },
  frekuensi_berbuah: { type: Number, required: true },
  rata2_volume_produksi_per_panen: { type: Number, required: true },
  pemanfaatan_produk: {
    type: [String],
    enum: [
      "kopi_biji_klengkeng",
      "kerajinan_tangan",
      "batik_ecoprint",
      "minuman",
      "makanan",
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
