import RumahTangga from "../models/rumahTanggaModel";
import { IRumahTangga } from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";
import updateAllRtAggregates from "./rtAndRutaService";

const VALID_KATEGORI_USAHA = [
  "kbli_a",
  "kbli_b",
  "kbli_c",
  "kbli_d",
  "kbli_e",
  "kbli_f",
  "kbli_g",
  "kbli_h",
  "kbli_i",
  "kbli_j",
  "kbli_k",
  "kbli_l",
  "kbli_m",
  "kbli_n",
  "kbli_o",
  "kbli_p",
  "kbli_q",
  "kbli_r",
  "kbli_s",
  "kbli_t",
  "kbli_u",
];

const VALID_LOKASI_TEMPAT_USAHA = [
  "bangunan-khusus-usaha",
  "bangunan-campuran",
  "kaki-lima",
  "keliling",
  "didalam-bangunan-tempat-tinggal/online",
];

const VALID_JENIS_KELAMIN = ["laki-laki", "perempuan"];

const VALID_PENDIDIKAN_TERAKHIR = [
  "sd/sederajat-kebawah",
  "smp/sederajat",
  "sma/sederajat",
  "diploma/s1-keatas",
];

const VALID_BENTUK_BADAN_USAHA = [
  "pt/persero/sejenisnya",
  "ijin-desa/ijin-lainnya",
  "tidak-berbadan-hukum",
];

const VALID_SKALA_USAHA = ["usaha-mikro", "usaha-kecil", "usaha-menengah"];

const validateRumahTanggaData = (data: IRumahTangga) => {
  if (!VALID_JENIS_KELAMIN.includes(data.jenis_kelamin)) {
    throw new Error(
      `Jenis kelamin tidak valid. Nilai valid: 'laki-laki' atau 'perempuan'.`
    );
  }

  if (!VALID_PENDIDIKAN_TERAKHIR.includes(data.pendidikan_terakhir)) {
    throw new Error(
      `Pendidikan terakhir tidak valid. Nilai valid: 'sd/sederajat-kebawah', 'smp/sederajat', 'sma/sederajat', atau 'diploma/s1-keatas'.`
    );
  }

  if (!VALID_KATEGORI_USAHA.includes(data.kategori_usaha)) {
    throw new Error(
      `Klasifikasi KBLI tidak valid. Nilai valid: 'kbli_a' - 'kbli_u'.`
    );
  }

  if (!VALID_BENTUK_BADAN_USAHA.includes(data.bentuk_badan_usaha)) {
    throw new Error(
      `Bentuk badan usaha tidak valid. Nilai valid: 'pt/persero/sejenisnya', 'ijin-desa/ijin-lainnya', atau 'tidak-berbadan-hukum'.`
    );
  }

  if (!VALID_LOKASI_TEMPAT_USAHA.includes(data.lokasi_tempat_usaha)) {
    throw new Error(
      `Jenis lokasi tempat usaha tidak valid. Nilai valid: 'bangunan-khusus-usaha', 'bangunan-campuran', 'kaki-lima', 'keliling', atau 'didalam-bangunan-tempat-tinggal/online'.`
    );
  }

  if (!VALID_SKALA_USAHA.includes(data.skala_usaha)) {
    throw new Error(
      `Skala usaha tidak valid. Nilai valid: 'usaha-mikro', 'usaha-kecil', atau 'usaha-menengah'.`
    );
  }
};

const addRumahTangga = async (data: IRumahTangga | IRumahTangga[]) => {
  const dataArray = Array.isArray(data) ? data : [data];

  for (const item of dataArray) {
    validateRumahTanggaData(item);
    const rt = await Rt.findOne({ kode: item.kodeRt });
    if (!rt) {
      throw new Error(
        `RT dengan kode ${item.kodeRt} tidak ditemukan. Pastikan kode RT yang dimasukkan benar.`
      );
    }
  }

  const newRumahTangga = await RumahTangga.insertMany(dataArray);
  await updateAllRtAggregates();

  return newRumahTangga;
};

const updateRumahTangga = async (kode: string, data: IRumahTangga) => {
  validateRumahTanggaData(data);

  const updatedRumahTangga = await RumahTangga.findOneAndUpdate(
    { kode },
    data,
    { new: true }
  );
  if (updatedRumahTangga) {
    await updateAllRtAggregates();
  } else {
    throw new Error(
      "Rumah Tangga dengan kode tersebut tidak ditemukan. Pastikan kode yang dimasukkan benar."
    );
  }

  return updatedRumahTangga;
};

const deleteRumahTangga = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOneAndDelete({ kode });
  if (rumahTangga) {
    await updateAllRtAggregates();
  } else {
    throw new Error(
      "Rumah Tangga dengan kode tersebut tidak ditemukan. Pastikan kode yang dimasukkan benar."
    );
  }

  return rumahTangga;
};

const getRumahTanggaByKode = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOne({ kode });
  if (!rumahTangga) {
    throw new Error("Rumah Tangga dengan kode tersebut tidak ditemukan.");
  }
  return rumahTangga;
};

const getAllRumahTangga = async () => {
  return await RumahTangga.find();
};

export default {
  addRumahTangga,
  updateRumahTangga,
  deleteRumahTangga,
  getRumahTanggaByKode,
  getAllRumahTangga,
};
