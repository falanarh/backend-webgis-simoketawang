import mongoose from "mongoose";
import Sls from "../models/slsModel";

const validateSlsDataCreate = (data: any) => {
  const { type, name, crs, features } = data;

  // Validasi type
  if (type !== "FeatureCollection") {
    throw new Error("Type harus 'FeatureCollection'.");
  }

  // Validasi name
  if (typeof name !== "string") {
    throw new Error("Name harus berupa string.");
  }

  // Validasi CRS
  if (
    crs.type !== "name" ||
    crs.properties.name !== "urn:ogc:def:crs:OGC:1.3:CRS84"
  ) {
    throw new Error(
      "Type CRS harus 'name' dan 'properties.name' harus 'urn:ogc:def:crs:OGC:1.3:CRS84'."
    );
  }

  // Validasi features
  if (
    !Array.isArray(features) ||
    !features.every((feature: any) => feature.type === "Feature")
  ) {
    throw new Error(
      "Features harus berupa array dan setiap item harus bertipe 'Feature'."
    );
  }

  features.forEach((feature: any) => {
    const { geometry, properties } = feature;

    // Validasi geometry
    if (geometry.type !== "MultiPolygon") {
      throw new Error("Tipe geometry harus 'MultiPolygon'.");
    }

    // Validasi coordinates
    if (
      !Array.isArray(geometry.coordinates) ||
      !validateCoordinates(geometry.coordinates, geometry.type)
    ) {
      throw new Error("Coordinates tidak valid.");
    }
  });
};

const validateCoordinates = (coordinates: any, type: string) => {
  // Validasi untuk MultiPolygon
  if (type === "MultiPolygon") {
    return coordinates.every(
      (polygon: any[]) =>
        Array.isArray(polygon) &&
        polygon.every(
          (ring: any[]) =>
            Array.isArray(ring) &&
            ring.every(
              (coord: any[]) => Array.isArray(coord) && coord.length === 2
            )
        )
    );
  }
  return false;
};

function sortGeoJsonByKode(geoJsonArray: any[]) {
  return geoJsonArray.sort((a, b) =>
    a.features[0].properties.kode.localeCompare(b.features[0].properties.kode)
  );
}

const getAllSls = async () => {
  const slsList = await Sls.find().select("geojson");
  const properties = slsList.map((sls) => sls.geojson.features[0].properties);

  properties.sort((a, b) => {
    const slsA = parseInt(a.sls, 10);
    const slsB = parseInt(b.sls, 10);
    return slsA - slsB;
  });

  return properties;
};

const getSlsByKode = async (kode: string) => {
  const sls = await Sls.findOne({ kode }).select("geojson");
  if (sls) {
    return sls.geojson.features[0].properties;
  }
  return null;
};

const createSls = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let createdSls = [];
    if (Array.isArray(data)) {
      for (const slsData of data) {
        validateSlsDataCreate(slsData);
        const newSls = new Sls({
          kode: slsData.features[0].properties.kode,
          nama: slsData.features[0].properties.label,
          geojson: slsData,
        });
        await newSls.save({ session });
        createdSls.push(newSls);
      }
    } else {
      validateSlsDataCreate(data);
      const newSls = new Sls({
        kode: data.features[0].properties.kode,
        nama: data.features[0].properties.label,
        geojson: data,
      });
      await newSls.save({ session });
      createdSls.push(newSls);
    }

    await session.commitTransaction();
    session.endSession();
    return createdSls;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateSls = async (kode: string, properties: any) => {
  const sls = await Sls.findOne({ kode });
  if (sls) {
    sls.geojson.features[0].properties = properties;
    return await sls.save();
  }

  throw new Error("SLS tidak ditemukan");
};

const deleteSls = async (kode: string) => {
  return await Sls.findOneAndDelete({ kode });
};

const getAllSlsGeoJSON = async () => {
  const slsList = await Sls.find().select("geojson");
  const geoJsonArray = slsList.map((sls) => sls.geojson);
  return sortGeoJsonByKode(geoJsonArray);
};

const calculateTotals = async () => {
  const slsList = await Sls.find().select("geojson");

  const totals = {
    jml_penduduk: 0,
    jml_unit_usaha_klengkeng: 0,
    jml_unit_usaha_klengkeng_new_crystal: 0,
    jml_unit_usaha_klengkeng_pingpong: 0,
    jml_unit_usaha_klengkeng_matalada: 0,
    jml_unit_usaha_klengkeng_diamond_river: 0,
    jml_unit_usaha_klengkeng_merah: 0,
    jml_unit_usaha_klengkeng_pupuk_organik: 0,
    jml_unit_usaha_klengkeng_pupuk_anorganik: 0,
    jml_unit_usaha_klengkeng_tidak_ada_pupuk: 0,
    jml_unit_usaha_klengkeng_kopi_biji_klengkeng: 0,
    jml_unit_usaha_klengkeng_kerajinan_tangan: 0,
    jml_unit_usaha_klengkeng_batik_ecoprint: 0,
    jml_unit_usaha_klengkeng_minuman: 0,
    jml_unit_usaha_klengkeng_makanan: 0,
    jml_pohon: 0,
    jml_pohon_blm_berproduksi: 0,
    jml_pohon_sdh_berproduksi: 0,
  };

  slsList.forEach((sls) => {
    const { features } = sls.geojson;
    if (features && features.length > 0) {
      const { properties } = features[0];
      totals.jml_penduduk += properties.jml_penduduk;
      totals.jml_unit_usaha_klengkeng += properties.jml_unit_usaha_klengkeng;
      totals.jml_unit_usaha_klengkeng_new_crystal +=
        properties.jml_unit_usaha_klengkeng_new_crystal;
      totals.jml_unit_usaha_klengkeng_pingpong +=
        properties.jml_unit_usaha_klengkeng_pingpong;
      totals.jml_unit_usaha_klengkeng_matalada +=
        properties.jml_unit_usaha_klengkeng_matalada;
      totals.jml_unit_usaha_klengkeng_diamond_river +=
        properties.jml_unit_usaha_klengkeng_diamond_river;
      totals.jml_unit_usaha_klengkeng_merah +=
        properties.jml_unit_usaha_klengkeng_merah;
      totals.jml_unit_usaha_klengkeng_pupuk_organik +=
        properties.jml_unit_usaha_klengkeng_pupuk_organik;
      totals.jml_unit_usaha_klengkeng_pupuk_anorganik +=
        properties.jml_unit_usaha_klengkeng_pupuk_anorganik;
      totals.jml_unit_usaha_klengkeng_tidak_ada_pupuk +=
        properties.jml_unit_usaha_klengkeng_tidak_ada_pupuk;
      totals.jml_unit_usaha_klengkeng_kopi_biji_klengkeng +=
        properties.jml_unit_usaha_klengkeng_kopi_biji_klengkeng;
      totals.jml_unit_usaha_klengkeng_kerajinan_tangan +=
        properties.jml_unit_usaha_klengkeng_kerajinan_tangan;
      totals.jml_unit_usaha_klengkeng_batik_ecoprint +=
        properties.jml_unit_usaha_klengkeng_batik_ecoprint;
      totals.jml_unit_usaha_klengkeng_minuman +=
        properties.jml_unit_usaha_klengkeng_minuman;
      totals.jml_unit_usaha_klengkeng_makanan +=
        properties.jml_unit_usaha_klengkeng_makanan;
      totals.jml_pohon += properties.jml_pohon;
      totals.jml_pohon_blm_berproduksi += properties.jml_pohon_blm_berproduksi;
      totals.jml_pohon_sdh_berproduksi += properties.jml_pohon_sdh_berproduksi;
    }
  });
  return totals;
};

export default {
  getAllSls,
  getSlsByKode,
  createSls,
  updateSls,
  deleteSls,
  getAllSlsGeoJSON,
  calculateTotals,
};
