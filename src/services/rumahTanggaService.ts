import RumahTangga from '../models/rumahTanggaModel';
import aggregationService from './rtService';
import { IRumahTangga } from '../models/rumahTanggaModel';

const addRumahTangga = async (data: IRumahTangga) => {
  const newRumahTangga = new RumahTangga(data);
  await newRumahTangga.save();
  await aggregationService.calculateAggregationForRT(newRumahTangga.rt);
  return newRumahTangga;
};

const updateRumahTangga = async (kode: string, data: Partial<IRumahTangga>) => {
  const updatedRumahTangga = await RumahTangga.findOneAndUpdate({ kode }, data, { new: true });
  if (updatedRumahTangga) {
    await aggregationService.calculateAggregationForRT(updatedRumahTangga.rt);
  }
  return updatedRumahTangga;
};

const deleteRumahTangga = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOneAndDelete({ kode });
  if (rumahTangga) {
    await aggregationService.calculateAggregationForRT(rumahTangga.rt);
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
