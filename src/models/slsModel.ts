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
    jml_unit_usaha_klengkeng: number;
    jml_unit_usaha_klengkeng_new_crystal: number;
    jml_unit_usaha_klengkeng_pingpong: number;
    jml_unit_usaha_klengkeng_matalada: number;
    jml_unit_usaha_klengkeng_diamond_river: number;
    jml_unit_usaha_klengkeng_merah: number;
    jml_unit_usaha_klengkeng_pupuk_organik: number;
    jml_unit_usaha_klengkeng_pupuk_anorganik: number;
    jml_unit_usaha_klengkeng_tidak_ada_pupuk: number;
    jml_unit_usaha_klengkeng_kopi_biji_klengkeng: number;
    jml_unit_usaha_klengkeng_kerajinan_tangan: number;
    jml_unit_usaha_klengkeng_batik_ecoprint: number;
    jml_unit_usaha_klengkeng_minuman: number;
    jml_unit_usaha_klengkeng_makanan: number;
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
interface ISls extends Document {
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
    label: { type: String, required: true },
    jml_unit_usaha_klengkeng: { type: Number, required: true },
    jml_unit_usaha_klengkeng_new_crystal: { type: Number, required: true },
    jml_unit_usaha_klengkeng_pingpong: { type: Number, required: true },
    jml_unit_usaha_klengkeng_matalada: { type: Number, required: true },
    jml_unit_usaha_klengkeng_diamond_river: { type: Number, required: true },
    jml_unit_usaha_klengkeng_merah: { type: Number, required: true },
    jml_unit_usaha_klengkeng_pupuk_organik: { type: Number, required: true },
    jml_unit_usaha_klengkeng_pupuk_anorganik: { type: Number, required: true },
    jml_unit_usaha_klengkeng_tidak_ada_pupuk: { type: Number, required: true },
    jml_unit_usaha_klengkeng_kopi_biji_klengkeng: {
      type: Number,
      required: true,
    },
    jml_unit_usaha_klengkeng_kerajinan_tangan: { type: Number, required: true },
    jml_unit_usaha_klengkeng_batik_ecoprint: { type: Number, required: true },
    jml_unit_usaha_klengkeng_minuman: { type: Number, required: true },
    jml_unit_usaha_klengkeng_makanan: { type: Number, required: true },
  },
});

// Skema untuk GeoJSONFeatureCollection
const GeoJSONFeatureCollectionSchema: Schema = new Schema({
  type: { type: String, enum: ["FeatureCollection"], required: true },
  name: { type: String, required: true },
  crs: { type: CRSSchema, required: true }, // Menggunakan skema CRS yang terbatas
  features: { type: [GeoJSONFeatureSchema], required: true },
});

// Skema untuk SLS
const SlsSchema: Schema = new Schema({
  kode: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  geojson: { type: GeoJSONFeatureCollectionSchema, required: true },
});

// Pastikan indeks unik untuk kode
SlsSchema.index({ kode: 1 }, { unique: true });

export default mongoose.model<ISls>("Sls", SlsSchema);
