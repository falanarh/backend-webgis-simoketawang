import RumahTangga from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";

// Validasi data RT
const validateRtDataCreate = (data: any) => {
  const { type, geometry, properties } = data;

  // Validasi type
  if (type !== "Feature") {
    throw new Error("Type harus 'Feature'.");
  }

  // Validasi geometry
  if (!["Polygon", "MultiPolygon"].includes(geometry.type)) {
    throw new Error("Tipe geometry harus 'Polygon' atau 'MultiPolygon'.");
  }

  // Validasi coordinates
  if (
    !Array.isArray(geometry.coordinates) ||
    !geometry.coordinates.every(
      (coord: any[]) =>
        Array.isArray(coord) &&
        coord.every(
          (subCoord: any[]) => Array.isArray(subCoord) && subCoord.length === 2
        )
    )
  ) {
    throw new Error(
      "Coordinates harus berupa array dari array yang berisi dua elemen."
    );
  }

  // Validasi properties
  const {
    kode,
    rt,
    rw,
    dusun,
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
    typeof rw !== "string" ||
    typeof dusun !== "string"
  ) {
    throw new Error("Kode, rt, rw, dan dusun harus berupa string.");
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

const validateRtDataEdit = (dataReq: any) => {
  const geojson = dataReq.geojson;
  const { type, geometry, properties } = geojson;

  // Validasi type
  if (type !== "Feature") {
    throw new Error("Type harus 'Feature'.");
  }

  // Validasi geometry
  if (!["Polygon", "MultiPolygon"].includes(geometry.type)) {
    throw new Error("Tipe geometry harus 'Polygon' atau 'MultiPolygon'.");
  }

  // Validasi coordinates
  if (
    !Array.isArray(geometry.coordinates) ||
    !geometry.coordinates.every(
      (coord: any[]) =>
        Array.isArray(coord) &&
        coord.every(
          (subCoord: any[]) => Array.isArray(subCoord) && subCoord.length === 2
        )
    )
  ) {
    throw new Error(
      "Coordinates harus berupa array dari array yang berisi dua elemen."
    );
  }

  // Validasi properties
  const {
    kode,
    rt,
    rw,
    dusun,
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
    typeof rw !== "string" ||
    typeof dusun !== "string"
  ) {
    throw new Error("Kode, rt, rw, dan dusun harus berupa string.");
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

// Mendapatkan semua RT dengan hanya properties dari geojson
const getAllRts = async () => {
  const rts = await Rt.find().select("geojson.properties"); // Pilih hanya properties dari geojson
  return rts.map(rt => rt.geojson.properties); // Ambil hanya atribut properties dari geojson
};

// Mendapatkan RT berdasarkan kode
const getRtByKode = async (kode: string) => {
  const rt = await Rt.findOne({ kode }).select("geojson.properties"); // Pilih hanya properties dari geojson
  if (rt) {
    return rt.geojson.properties; // Ambil hanya atribut properties dari geojson
  }
  return null; // Return null if no RT is found
};

// Membuat RT baru
const createRt = async (data: any) => {
  validateRtDataCreate(data);
  const newRt = new Rt({
    kode: data.properties.kode,
    nama: "RT" + data.properties.rt,
    geojson: data,
  });
  await newRt.save();
  return newRt;
};

// Memperbarui RT berdasarkan kode
const updateRt = async (kode: string, data: any) => {
  validateRtDataEdit(data);
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
    await Rt.findOneAndUpdate(
      { kode: rtKode },
      {
        "geojson.properties.umkmStats": {
          householdCount: stats.householdCount,
          businessTypes: stats.businessTypes.filter(Boolean),
          averageIncome: stats.averageIncome || 0,
        },
      }
    );
  }
};

// Mendapatkan semua geoJSON dari RT
const getAllRtGeoJSON = async () => {
  const rtList = await Rt.find().select("geojson");
  return rtList.map((rt) => rt.geojson); // Ambil hanya atribut geojson
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
