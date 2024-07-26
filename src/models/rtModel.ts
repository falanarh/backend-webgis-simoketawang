import mongoose, { Document, Schema } from "mongoose";

interface IGeoJSON extends Document {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
  properties: {
    kode: string;
    rt: string;
    rw: string;
    dusun: string;
    jml_ruta: number;
    jml_umkm: number;
    jml_umkm_tetap: number;
    jml_umkm_nontetap: number;
    jml_umkm_kbli_a: number;
    jml_umkm_kbli_b: number;
    jml_umkm_kbli_c: number;
    jml_umkm_kbli_d: number;
    jml_umkm_kbli_e: number;
    jml_umkm_kbli_f: number;
    jml_umkm_kbli_g: number;
    jml_umkm_kbli_h: number;
    jml_umkm_kbli_i: number;
    jml_umkm_kbli_j: number;
    jml_umkm_kbli_k: number;
    jml_umkm_kbli_l: number;
    jml_umkm_kbli_m: number;
    jml_umkm_kbli_n: number;
    jml_umkm_kbli_o: number;
    jml_umkm_kbli_p: number;
    jml_umkm_kbli_q: number;
    jml_umkm_kbli_r: number;
    jml_umkm_kbli_s: number;
    jml_umkm_kbli_t: number;
    jml_umkm_kbli_u: number;
    [key: string]: any; // For any other additional properties
  };
}

interface IRt extends Document {
  kode: string;
  nama: string;
  geojson: IGeoJSON;
}

const GeoJSONSchema: Schema = new Schema({
  type: { type: String, enum: ["Feature"], required: true },
  geometry: {
    type: {
      type: String,
      enum: [
        "Point",
        "LineString",
        "Polygon",
        "MultiPoint",
        "MultiLineString",
        "MultiPolygon",
      ],
      required: true,
    },
    coordinates: { type: Schema.Types.Mixed, required: true },
  },
  properties: {
    kode: { type: String, required: true },
    rt: { type: String, required: true },
    rw: { type: String, required: true },
    dusun: { type: String, required: true },
    jml_ruta: { type: Number, required: true },
    jml_umkm: { type: Number, required: true },
    jml_umkm_tetap: { type: Number, required: true },
    jml_umkm_nontetap: { type: Number, required: true },
    jml_umkm_kbli_a: { type: Number, required: true },
    jml_umkm_kbli_b: { type: Number, required: true },
    jml_umkm_kbli_c: { type: Number, required: true },
    jml_umkm_kbli_d: { type: Number, required: true },
    jml_umkm_kbli_e: { type: Number, required: true },
    jml_umkm_kbli_f: { type: Number, required: true },
    jml_umkm_kbli_g: { type: Number, required: true },
    jml_umkm_kbli_h: { type: Number, required: true },
    jml_umkm_kbli_i: { type: Number, required: true },
    jml_umkm_kbli_j: { type: Number, required: true },
    jml_umkm_kbli_k: { type: Number, required: true },
    jml_umkm_kbli_l: { type: Number, required: true },
    jml_umkm_kbli_m: { type: Number, required: true },
    jml_umkm_kbli_n: { type: Number, required: true },
    jml_umkm_kbli_o: { type: Number, required: true },
    jml_umkm_kbli_p: { type: Number, required: true },
    jml_umkm_kbli_q: { type: Number, required: true },
    jml_umkm_kbli_r: { type: Number, required: true },
    jml_umkm_kbli_s: { type: Number, required: true },
    jml_umkm_kbli_t: { type: Number, required: true },
    jml_umkm_kbli_u: { type: Number, required: true },
    // Additional properties can be added here
  },
});

const RtSchema: Schema = new Schema({
  kode: { type: String, required: true, unique: true }, // Added kode as primary key
  nama: { type: String, required: true }, // Added nama field
  geojson: { type: GeoJSONSchema, required: true },
});

// Ensure unique index for kode
RtSchema.index({ kode: 1 }, { unique: true });

export default mongoose.model<IRt>("Rt", RtSchema);
