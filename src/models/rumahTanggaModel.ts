import mongoose, { Document, Schema } from "mongoose";

interface IRumahTangga extends Document {
  kode: string; // Primary key
  namaKrt: string; // Name of the head of household
  kodeRt: string;
  rt: string; // RT code
  rw: string; // RW code
  // dusun: string; // Dusun information
  klasifikasiKbli: string; // Classification of business
  jenisUmkm: string; // Type of UMKM
  latitude: string; // Latitude
  longitude: string; // Longitude
}

// Define schema
const RumahTanggaSchema: Schema = new Schema({
  // Define `kode` as the primary key
  kode: { type: String, required: true, unique: true },
  namaKrt: { type: String, required: true },
  kodeRt: { type: String, required: true },
  rt: { type: String, required: true },
  rw: { type: String, required: true },
  // dusun: { type: String, required: true },
  klasifikasiKbli: { type: String, required: true },
  jenisUmkm: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

// Ensure unique index for kode
RumahTanggaSchema.index({ kode: 1 }, { unique: true });

// Create model
export { IRumahTangga };

export default mongoose.model<IRumahTangga>("RumahTangga", RumahTanggaSchema);
