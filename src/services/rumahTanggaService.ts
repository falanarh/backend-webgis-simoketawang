import RumahTangga from '../models/rumahTanggaModel';
import aggregationService from './rtService';
import { IRumahTangga } from '../models/rumahTanggaModel';

const addRumahTangga = async (data: IRumahTangga) => {
  const newRumahTangga = new RumahTangga(data);
  await newRumahTangga.save();
  await aggregationService.calculateAggregationForRT(newRumahTangga.rt);
  return newRumahTangga;
};

const updateRumahTangga = async (id: string, data: Partial<IRumahTangga>) => {
  const updatedRumahTangga = await RumahTangga.findByIdAndUpdate(id, data, { new: true });
  if (updatedRumahTangga) {
    await aggregationService.calculateAggregationForRT(updatedRumahTangga.rt);
  }
  return updatedRumahTangga;
};

const deleteRumahTangga = async (id: string) => {
  const rumahTangga = await RumahTangga.findByIdAndDelete(id);
  if (rumahTangga) {
    await aggregationService.calculateAggregationForRT(rumahTangga.rt);
  }
  return rumahTangga;
};

const getRumahTanggaById = async (id: string) => {
  return await RumahTangga.findById(id);
};

const getAllRumahTangga = async () => {
  return await RumahTangga.find();
};

export default {
  addRumahTangga,
  updateRumahTangga,
  deleteRumahTangga,
  getRumahTanggaById,
  getAllRumahTangga,
};