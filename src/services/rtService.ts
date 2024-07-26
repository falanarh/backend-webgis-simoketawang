import RumahTangga from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";

// Mendapatkan semua RT
const getAllRts = async () => {
  return await Rt.find();
};

// Mendapatkan RT berdasarkan kode
const getRtByKode = async (kode: string) => {
  return await Rt.findOne({ kode });
};

// Membuat RT baru
const createRt = async (data: any) => {
  const newRt = new Rt(data);
  await newRt.save();
  return newRt;
};

// Memperbarui RT berdasarkan kode
const updateRt = async (kode: string, data: any) => {
  return await Rt.findOneAndUpdate({ kode }, data, { new: true });
};

// Menghapus RT berdasarkan kode
const deleteRt = async (kode: string) => {
  return await Rt.findOneAndDelete({ kode });
};

// Menghitung agregasi untuk RT
const calculateAggregationForRT = async (rtKode: string) => {
  const aggregation = await RumahTangga.aggregate([
    { $match: { rt: rtKode } },
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
    await Rt.findOneAndUpdate({ kode: rtKode }, {
      "geojson.properties.umkmStats": {
        householdCount: stats.householdCount,
        businessTypes: stats.businessTypes.filter(Boolean),
        averageIncome: stats.averageIncome || 0,
      },
    });
  }
};

// Mendapatkan semua geoJSON dari RT
const getAllRtGeoJSON = async () => {
  const rtList = await Rt.find().select("geojson");
  return rtList.map(rt => rt.geojson); // Ambil hanya atribut geojson
};

export default {
  getAllRts,
  getRtByKode, // Perubahan di sini
  createRt,
  updateRt,
  deleteRt,
  calculateAggregationForRT,
  getAllRtGeoJSON,
};
