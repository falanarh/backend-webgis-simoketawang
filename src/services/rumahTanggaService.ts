import RumahTangga from '../models/rumahTanggaModel';
import { IRumahTangga } from '../models/rumahTanggaModel';
import Rt from '../models/rtModel'; 
import { updateRtData } from './rtAndRutaService';

const VALID_KLASIFIKASI_KBLI = [
  "kbli_a", "kbli_b", "kbli_c", "kbli_d", "kbli_e",
  "kbli_f", "kbli_g", "kbli_h", "kbli_i", "kbli_j",
  "kbli_k", "kbli_l", "kbli_m", "kbli_n", "kbli_o",
  "kbli_p", "kbli_q", "kbli_r", "kbli_s", "kbli_t",
  "kbli_u"
];

const VALID_JENIS_UMKM = ["tetap", "nontetap"];

const validateRumahTanggaData = (data: IRumahTangga) => {
  if (!VALID_KLASIFIKASI_KBLI.includes(data.klasifikasiKbli)) {
    throw new Error(`Klasifikasi KBLI tidak valid. Nilai valid: 'kbli_a' - 'kbli_u'.`);
  }
  if (!VALID_JENIS_UMKM.includes(data.jenisUmkm)) {
    throw new Error(`Jenis UMKM tidak valid. Nilai valid: 'tetap' atau 'nontetap'.`);
  }
};

const addRumahTangga = async (data: IRumahTangga) => {
  validateRumahTanggaData(data);

  const rt = await Rt.findOne({ kode: data.kodeRt });
  if (!rt) {
    throw new Error('RT dengan kode tersebut tidak ditemukan. Pastikan kode RT yang dimasukkan benar.');
  }
  
  const newRumahTangga = new RumahTangga(data);
  await newRumahTangga.save();
  await updateRtData(data.kodeRt);
  
  return newRumahTangga;
};

const updateRumahTangga = async (kode: string, data: IRumahTangga) => {
  validateRumahTanggaData(data);

  const updatedRumahTangga = await RumahTangga.findOneAndUpdate({ kode }, data, { new: true });
  if (updatedRumahTangga) {
    await updateRtData(data.kodeRt);
  } else {
    throw new Error('Rumah Tangga dengan kode tersebut tidak ditemukan. Pastikan kode yang dimasukkan benar.');
  }
  
  return updatedRumahTangga;
};

const deleteRumahTangga = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOneAndDelete({ kode });
  if (rumahTangga) {
    await updateRtData(rumahTangga.kodeRt);
  } else {
    throw new Error('Rumah Tangga dengan kode tersebut tidak ditemukan. Pastikan kode yang dimasukkan benar.');
  }
  
  return rumahTangga;
};

const getRumahTanggaByKode = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOne({ kode });
  if (!rumahTangga) {
    throw new Error('Rumah Tangga dengan kode tersebut tidak ditemukan.');
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
