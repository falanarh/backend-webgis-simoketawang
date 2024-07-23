import mongoose, { Document, Schema } from "mongoose";

interface IRumahTangga extends Document {
  rt: mongoose.Types.ObjectId;  // Reference to the RT
  headOfHousehold: string;
  hasUMKM: boolean;
  businessType?: string;
  income?: number;
}

const RumahTanggaSchema: Schema = new Schema({
  rt: { type: mongoose.Types.ObjectId, ref: 'Rt', required: true },
  headOfHousehold: { type: String, required: true },
  hasUMKM: { type: Boolean, required: true },
  businessType: { type: String },
  income: { type: Number },
});

export { IRumahTangga };

export default mongoose.model<IRumahTangga>("RumahTangga", RumahTanggaSchema);