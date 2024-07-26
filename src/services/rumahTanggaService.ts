import RumahTangga from '../models/rumahTanggaModel';
import { IRumahTangga } from '../models/rumahTanggaModel';
import Rt from '../models/rtModel'; 
import { updateRtData } from './rtAndRutaService';

const addRumahTangga = async (data: IRumahTangga) => {
  const rt = await Rt.findOne({ kode: data.kodeRt });
  if (!rt) {
    throw new Error('RT tidak ditemukan');
  }
  const newRumahTangga = new RumahTangga(data);
  await newRumahTangga.save();
  await updateRtData(data.kodeRt);
  return newRumahTangga;
};

const updateRumahTangga = async (kode: string, data: IRumahTangga) => {
  const updatedRumahTangga = await RumahTangga.findOneAndUpdate({ kode }, data, { new: true });
  if (updatedRumahTangga) {
    await updateRtData(data.kodeRt);
  }
  return updatedRumahTangga;
};

const deleteRumahTangga = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOneAndDelete({ kode });
  if (rumahTangga) {
    await updateRtData(rumahTangga.kodeRt);
  }
  return rumahTangga;
};

const getRumahTanggaByKode = async (kode: string) => {
  return await RumahTangga.findOne({ kode });
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
