import mongoose, { Document, Schema } from "mongoose";

// Interface untuk CRS yang terbatas
interface ICRS {
  type: string;
  properties: {
    name: "urn:ogc:def:crs:OGC:1.3:CRS84";
  };
}

// Interface untuk GeoJSONFeature
interface IGeoJSONFeature extends Document {
  type: "Feature";
  geometry: {
    type:
      | "Point"
      | "LineString"
      | "Polygon"
      | "MultiPoint"
      | "MultiLineString"
      | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][]; // Menyesuaikan untuk semua tipe geometris GeoJSON
  };
  properties: {
    kode: string;
    rt: string;
    rw: string;
    dusun: string;
    label: string;
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
    total_pendapatan_sebulan_terakhir: number;
    [key: string]: any; // Untuk properti tambahan lainnya
  };
}

// Interface untuk GeoJSONFeatureCollection
interface IGeoJSONFeatureCollection extends Document {
  type: "FeatureCollection";
  name: string;
  crs: ICRS; // Menggunakan skema CRS yang terbatas
  features: IGeoJSONFeature[];
}

// Interface untuk Rt
interface IRt extends Document {
  kode: string;
  nama: string;
  geojson: IGeoJSONFeatureCollection;
}

// Skema untuk CRS yang terbatas
const CRSSchema: Schema = new Schema({
  type: { type: String, required: true },
  properties: {
    name: {
      type: String,
      enum: ["urn:ogc:def:crs:OGC:1.3:CRS84"],
      required: true,
    },
  },
});

// Skema untuk GeoJSONFeature
const GeoJSONFeatureSchema: Schema = new Schema({
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
    label : { type: String, required: true },
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
    total_pendapatan_sebulan_terakhir: { type: Number, required: true },
    // Properti tambahan bisa ditambahkan di sini
  },
});

// Skema untuk GeoJSONFeatureCollection
const GeoJSONFeatureCollectionSchema: Schema = new Schema({
  type: { type: String, enum: ["FeatureCollection"], required: true },
  name: { type: String, required: true },
  crs: { type: CRSSchema, required: true }, // Menggunakan skema CRS yang terbatas
  features: { type: [GeoJSONFeatureSchema], required: true },
});

// Skema untuk Rt
const RtSchema: Schema = new Schema({
  kode: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  geojson: { type: GeoJSONFeatureCollectionSchema, required: true },
});

// Pastikan indeks unik untuk kode
RtSchema.index({ kode: 1 }, { unique: true });

export default mongoose.model<IRt>("Rt", RtSchema);
