// src/services/rtService.ts
import mongoose from "mongoose";
import RumahTangga from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";

const getAllRts = async () => {
  return await Rt.find();
};

const getRtById = async (id: string) => {
  return await Rt.findById(id);
};

const createRt = async (data: any) => {
  const newRt = new Rt(data);
  await newRt.save();
  return newRt;
};

const updateRt = async (id: string, data: any) => {
  return await Rt.findByIdAndUpdate(id, data, { new: true });
};

const deleteRt = async (id: string) => {
  return await Rt.findByIdAndDelete(id);
};

const calculateAggregationForRT = async (rtId: mongoose.Types.ObjectId) => {
  const aggregation = await RumahTangga.aggregate([
    { $match: { rt: rtId } },
    {
      $group: {
        _id: "$rt",
        householdCount: { $sum: 1 },
        businessTypes: { $addToSet: "$businessType" },
        averageIncome: { $avg: "$income" },
      },
    },
  ]);

  if (aggregation.length > 0) {
    const stats = aggregation[0];
    await Rt.findByIdAndUpdate(rtId, {
      "geojson.properties.umkmStats": {
        householdCount: stats.householdCount,
        businessTypes: stats.businessTypes.filter(Boolean),
        averageIncome: stats.averageIncome || 0,
      },
    });
  }
};

const getAllRtGeoJSON = async () => {
  const rtList = await Rt.find().select("geojson");
  return rtList.map(rt => rt.geojson); // Ambil hanya atribut geojson
};

export default {
  getAllRts,
  getRtById,
  createRt,
  updateRt,
  deleteRt,
  calculateAggregationForRT,
  getAllRtGeoJSON,
};
