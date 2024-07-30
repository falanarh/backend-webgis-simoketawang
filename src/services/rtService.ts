import mongoose from "mongoose";
import Rt from "../models/rtModel";

// Validasi data RT untuk pembuatan
const validateRtDataCreate = (data: any) => {
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

    // Validasi properties
    validateProperties(properties);
  });
};

// Validasi data RT untuk pengeditan
const validateRtDataEdit = (dataProps: any) => {
  // Validasi properties
  validateProperties(dataProps);
};

// Validasi koordinat berdasarkan tipe geometry
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

// Validasi properties untuk RT
const validateProperties = (properties: any) => {
  const {
    kode,
    rt,
    rw,
    jml_ruta,
    jml_umkm,
    jml_umkm_tetap,
    jml_umkm_nontetap,
    jml_umkm_kbli_a,
    jml_umkm_kbli_b,
    jml_umkm_kbli_c,
    jml_umkm_kbli_d,
    jml_umkm_kbli_e,
    jml_umkm_kbli_f,
    jml_umkm_kbli_g,
    jml_umkm_kbli_h,
    jml_umkm_kbli_i,
    jml_umkm_kbli_j,
    jml_umkm_kbli_k,
    jml_umkm_kbli_l,
    jml_umkm_kbli_m,
    jml_umkm_kbli_n,
    jml_umkm_kbli_o,
    jml_umkm_kbli_p,
    jml_umkm_kbli_q,
    jml_umkm_kbli_r,
    jml_umkm_kbli_s,
    jml_umkm_kbli_t,
    jml_umkm_kbli_u,
  } = properties;

  if (
    typeof kode !== "string" ||
    typeof rt !== "string" ||
    typeof rw !== "string"
  ) {
    throw new Error("Kode, rt, rw harus berupa string.");
  }

  if (
    typeof jml_ruta !== "number" ||
    typeof jml_umkm !== "number" ||
    typeof jml_umkm_tetap !== "number" ||
    typeof jml_umkm_nontetap !== "number"
  ) {
    throw new Error(
      "Jumlah ruta, UMKM, UMKM tetap, dan UMKM non-tetap harus berupa angka."
    );
  }

  if (jml_umkm > jml_ruta) {
    throw new Error(
      "Jumlah UMKM harus kurang dari atau sama dengan jumlah ruta."
    );
  }

  if (jml_umkm_tetap + jml_umkm_nontetap !== jml_umkm) {
    throw new Error(
      "Total jumlah UMKM tetap dan non-tetap harus sama dengan jumlah UMKM."
    );
  }

  const totalKbli =
    jml_umkm_kbli_a +
    jml_umkm_kbli_b +
    jml_umkm_kbli_c +
    jml_umkm_kbli_d +
    jml_umkm_kbli_e +
    jml_umkm_kbli_f +
    jml_umkm_kbli_g +
    jml_umkm_kbli_h +
    jml_umkm_kbli_i +
    jml_umkm_kbli_j +
    jml_umkm_kbli_k +
    jml_umkm_kbli_l +
    jml_umkm_kbli_m +
    jml_umkm_kbli_n +
    jml_umkm_kbli_o +
    jml_umkm_kbli_p +
    jml_umkm_kbli_q +
    jml_umkm_kbli_r +
    jml_umkm_kbli_s +
    jml_umkm_kbli_t +
    jml_umkm_kbli_u;

  if (totalKbli !== jml_umkm) {
    throw new Error(
      "Total jumlah UMKM berdasarkan KBLI harus sama dengan jumlah UMKM."
    );
  }
};

const getAllRts = async () => {
  const rts = await Rt.find().select("geojson"); // Fetch all geojson
  const properties = rts.map((rt) => rt.geojson.features[0].properties);

  // Sort the properties array based on the `rt` property
  properties.sort((a, b) => {
    const rtA = parseInt(a.rt, 10); // Convert rt to number
    const rtB = parseInt(b.rt, 10); // Convert rt to number
    return rtA - rtB; // Sort in ascending order
  });

  return properties;
};

// Mendapatkan RT berdasarkan kode
const getRtByKode = async (kode: string) => {
  const rt = await Rt.findOne({ kode }).select("geojson");
  if (rt) {
    return rt.geojson.features[0].properties;
  }
  return null;
};

// Membuat RT baru atau beberapa RT
const createRt = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let createdRts = [];

    if (Array.isArray(data)) {
      // Data adalah array objek RT
      for (const rtData of data) {
        validateRtDataCreate(rtData);

        const newRt = new Rt({
          kode: rtData.features[0].properties.kode, // assuming all features have the same kode
          nama: "RT" + rtData.features[0].properties.rt, // assuming all features have the same rt
          geojson: rtData,
        });

        await newRt.save({ session });
        createdRts.push(newRt);
      }
    } else {
      // Data adalah satu objek RT
      validateRtDataCreate(data);

      const newRt = new Rt({
        kode: data.features[0].properties.kode, // assuming all features have the same kode
        nama: "RT" + data.features[0].properties.rt, // assuming all features have the same rt
        geojson: data,
      });

      await newRt.save({ session });
      createdRts.push(newRt);
    }

    await session.commitTransaction();
    session.endSession();
    return createdRts;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Memperbarui RT berdasarkan kode
const updateRt = async (kode: string, properties: any) => {
  validateRtDataEdit(properties);

  // Find the RT and update its properties
  const rt = await Rt.findOne({ kode });
  if (rt) {
    // Assuming only one feature, update its properties
    rt.geojson.features[0].properties = properties;
    return await rt.save();
  }

  throw new Error("RT dengan kode tersebut tidak ditemukan.");
};

// Menghapus RT berdasarkan kode
const deleteRt = async (kode: string) => {
  return await Rt.findOneAndDelete({ kode });
};

// Fungsi untuk mengurutkan array GeoJSON berdasarkan properti 'name'
function sortGeoJsonByKode(geoJsonArray: any[]) {
  return geoJsonArray.sort((a, b) => a.features[0].properties.kode.localeCompare(b.features[0].properties.kode));
}

// Mengambil semua geoJSON dari RT
const getAllRtGeoJSON = async () => {
  const rtList = await Rt.find().select("geojson");
  const geoJsonArray = rtList.map((rt) => rt.geojson);
  
  return sortGeoJsonByKode(geoJsonArray);
};

// Menghitung total jumlah ruta, UMKM, dan UMKM berdasarkan KBLI dari seluruh RT
const calculateTotals = async () => {
  // Ambil semua RT
  const rts = await Rt.find().select("geojson");

  // Inisialisasi total dengan nilai awal 0
  const totals = {
    jml_ruta: 0,
    jml_umkm: 0,
    jml_umkm_tetap: 0,
    jml_umkm_nontetap: 0,
    jml_umkm_kbli_a: 0,
    jml_umkm_kbli_b: 0,
    jml_umkm_kbli_c: 0,
    jml_umkm_kbli_d: 0,
    jml_umkm_kbli_e: 0,
    jml_umkm_kbli_f: 0,
    jml_umkm_kbli_g: 0,
    jml_umkm_kbli_h: 0,
    jml_umkm_kbli_i: 0,
    jml_umkm_kbli_j: 0,
    jml_umkm_kbli_k: 0,
    jml_umkm_kbli_l: 0,
    jml_umkm_kbli_m: 0,
    jml_umkm_kbli_n: 0,
    jml_umkm_kbli_o: 0,
    jml_umkm_kbli_p: 0,
    jml_umkm_kbli_q: 0,
    jml_umkm_kbli_r: 0,
    jml_umkm_kbli_s: 0,
    jml_umkm_kbli_t: 0,
    jml_umkm_kbli_u: 0,
  };

  // Iterasi setiap RT dan akumulasi nilai
  rts.forEach(rt => {
    const { features } = rt.geojson;
    if (features && features.length > 0) {
      const { properties } = features[0];
      totals.jml_ruta += properties.jml_ruta || 0;
      totals.jml_umkm += properties.jml_umkm || 0;
      totals.jml_umkm_tetap += properties.jml_umkm_tetap || 0;
      totals.jml_umkm_nontetap += properties.jml_umkm_nontetap || 0;
      totals.jml_umkm_kbli_a += properties.jml_umkm_kbli_a || 0;
      totals.jml_umkm_kbli_b += properties.jml_umkm_kbli_b || 0;
      totals.jml_umkm_kbli_c += properties.jml_umkm_kbli_c || 0;
      totals.jml_umkm_kbli_d += properties.jml_umkm_kbli_d || 0;
      totals.jml_umkm_kbli_e += properties.jml_umkm_kbli_e || 0;
      totals.jml_umkm_kbli_f += properties.jml_umkm_kbli_f || 0;
      totals.jml_umkm_kbli_g += properties.jml_umkm_kbli_g || 0;
      totals.jml_umkm_kbli_h += properties.jml_umkm_kbli_h || 0;
      totals.jml_umkm_kbli_i += properties.jml_umkm_kbli_i || 0;
      totals.jml_umkm_kbli_j += properties.jml_umkm_kbli_j || 0;
      totals.jml_umkm_kbli_k += properties.jml_umkm_kbli_k || 0;
      totals.jml_umkm_kbli_l += properties.jml_umkm_kbli_l || 0;
      totals.jml_umkm_kbli_m += properties.jml_umkm_kbli_m || 0;
      totals.jml_umkm_kbli_n += properties.jml_umkm_kbli_n || 0;
      totals.jml_umkm_kbli_o += properties.jml_umkm_kbli_o || 0;
      totals.jml_umkm_kbli_p += properties.jml_umkm_kbli_p || 0;
      totals.jml_umkm_kbli_q += properties.jml_umkm_kbli_q || 0;
      totals.jml_umkm_kbli_r += properties.jml_umkm_kbli_r || 0;
      totals.jml_umkm_kbli_s += properties.jml_umkm_kbli_s || 0;
      totals.jml_umkm_kbli_t += properties.jml_umkm_kbli_t || 0;
      totals.jml_umkm_kbli_u += properties.jml_umkm_kbli_u || 0;
    }
  });

  return totals;
};

export default {
  getAllRts,
  getRtByKode,
  createRt,
  updateRt,
  deleteRt,
  getAllRtGeoJSON,
  calculateTotals, 
};
