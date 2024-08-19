import mongoose, { Document, Schema } from "mongoose";

interface IRumahTangga extends Document {
  kode: string;
  kodeRt: string;
  rt_rw_dusun: string;
  nama_kepala_keluarga: string;
  no_urut_bangunan: string;
  alamat: string;
  nama_usaha: string;
  latitude: string;
  longitude: string;
  nama_pemilik_penanggungjawab: string;
  jenis_kelamin: "laki-laki" | "perempuan";
  tanggal_lahir: string;
  nik: string;
  no_hp: string;
  pendidikan_terakhir:
    | "sd/sederajat-kebawah"
    | "smp/sederajat"
    | "sma/sederajat"
    | "diploma/s1-keatas";
  kategori_usaha:
    | "klbi_a"
    | "klbi_b"
    | "klbi_c"
    | "klbi_d"
    | "klbi_e"
    | "klbi_f"
    | "klbi_g"
    | "klbi_h"
    | "klbi_i"
    | "klbi_j"
    | "klbi_k"
    | "klbi_l"
    | "klbi_m"
    | "klbi_n"
    | "klbi_o"
    | "klbi_p"
    | "klbi_q"
    | "klbi_r"
    | "klbi_s"
    | "klbi_t"
    | "klbi_u";
  kegiatan_utama_usaha: string;
  bentuk_badan_usaha:
    | "pt/persero/sejenisnya"
    | "ijin-desa/ijin-lainnya"
    | "tidak-berbadan-hukum";
  lokasi_tempat_usaha:
    | "bangunan-khusus-usaha"
    | "bangunan-campuran"
    | "kaki-lima"
    | "keliling"
    | "didalam-bangunan-tempat-tinggal/online";
  skala_usaha: "usaha-mikro" | "usaha-kecil" | "usaha-menengah";
  catatan: string;
}

// Define schema
const RumahTanggaSchema: Schema = new Schema({
  // Define `kode` as the primary key
  kode: { type: String, required: true, unique: true },
  kodeRt: { type: String, required: true },
  rt_rw_dusun: { type: String, required: true },
  nama_kepala_keluarga: { type: String, required: true },
  no_urut_bangunan: { type: String, required: true },
  alamat: { type: String, required: true },
  nama_usaha: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  nama_pemilik_penanggungjawab: { type: String, required: true },
  jenis_kelamin: {
    type: String,
    enum: ["laki-laki", "perempuan"],
    required: true,
  },
  tanggal_lahir: { type: String, required: true },
  nik: { type: String, required: true },
  no_hp: { type: String, required: true },
  pendidikan_terakhir: {
    type: String,
    enum: [
      "sd/sederajat-kebawah",
      "smp/sederajat",
      "sma/sederajat",
      "diploma/s1-keatas",
    ],
    required: true,
  },
  kategori_usaha: {
    type: String,
    enum: [
      "kbli_a",
      "kbli_b",
      "kbli_c",
      "kbli_d",
      "kbli_e",
      "kbli_f",
      "kbli_g",
      "kbli_h",
      "kbli_i",
      "kbli_j",
      "kbli_k",
      "kbli_l",
      "kbli_m",
      "kbli_n",
      "kbli_o",
      "kbli_p",
      "kbli_q",
      "kbli_r",
      "kbli_s",
      "kbli_t",
      "kbli_u",
    ],
    required: true,
  },
  kegiatan_utama_usaha: {
    type: String,
    required: true,
  },
  bentuk_badan_usaha: {
    type: String,
    enum: [
      "pt/persero/sejenisnya",
      "ijin-desa/ijin-lainnya",
      "tidak-berbadan-hukum",
    ],
    required: true,
  },
  lokasi_tempat_usaha: {
    type: String,
    enum: [
      "bangunan-khusus-usaha",
      "bangunan-campuran",
      "kaki-lima",
      "keliling",
      "didalam-bangunan-tempat-tinggal/online",
    ],
    required: true,
  },
  skala_usaha: {
    type: String,
    enum: ["usaha-mikro", "usaha-kecil", "usaha-menengah"],
    required: true,
  },
  catatan: { type: String },
});

// Ensure unique index for kode
RumahTanggaSchema.index({ kode: 1 }, { unique: true });

// Create model
export { IRumahTangga };

export default mongoose.model<IRumahTangga>("RumahTangga", RumahTanggaSchema);
