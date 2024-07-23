import mongoose, { Document, Schema } from "mongoose";

interface IGeoJSON extends Document {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
  properties: {
    code: string;
    name: string;
    umkmStats: {
      householdCount: number;
      businessTypes: string[];
      averageIncome: number;
    };
    [key: string]: any; // For any other additional properties
  };
}

interface IRt extends Document {
  name: string;
  geojson: IGeoJSON;
}

const GeoJSONSchema: Schema = new Schema({
  type: { type: String, enum: ["Feature"], required: true },
  geometry: {
    type: {
      type: String,
      enum: ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"],
      required: true,
    },
    coordinates: { type: Schema.Types.Mixed, required: true },
  },
  properties: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    umkmStats: {
      householdCount: { type: Number, required: true },
      businessTypes: { type: [String], required: true },
      averageIncome: { type: Number, required: true },
    },
    // Additional properties can be added here
  },
});

const RtSchema: Schema = new Schema({
  name: { type: String, required: true },
  geojson: { type: GeoJSONSchema, required: true },
});

export default mongoose.model<IRt>("Rt", RtSchema);