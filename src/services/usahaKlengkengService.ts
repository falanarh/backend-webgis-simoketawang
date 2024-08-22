import { IUsahaKlengkeng } from "../models/usahaKlengkengModel";
import Sls from "../models/slsModel";
import UsahaKlengkeng from "../models/usahaKlengkengModel";
import mongoose from "mongoose";
import updateAllSlsAggregates from "./slsAndUsahaKlengkengService";

const VALID_JENIS_KLENGKENG = [
  "new_crystal",
  "pingpong",
  "matalada",
  "diamond_river",
  "merah",
];

const VALID_JENIS_PUPUK = ["organik", "anorganik", "tidak_ada_pupuk"];

const VALID_PEMANFAATAN_PRODUK = [
  "kopi_biji_klengkeng",
  "kerajinan_tangan",
  "batik_ecoprint",
  "minuman",
  "makanan",
];

const validateUsahaKlengkengData = (data: IUsahaKlengkeng) => {
  if (!VALID_JENIS_KLENGKENG.includes(data.jenis_klengkeng)) {
    throw new Error(
      `Jenis klengkeng tidak valid. Nilai valid: 'new_crystal', 'pingpong', 'matalada', 'diamond_river', 'merah'.`
    );
  }

  if (!VALID_JENIS_PUPUK.includes(data.jenis_pupuk)) {
    throw new Error(
      `Jenis pupuk tidak valid. Nilai valid: 'organik', 'anorganik', 'tidak_ada_pupuk'.`
    );
  }

  for (const produk of data.pemanfaatan_produk) {
    if (!VALID_PEMANFAATAN_PRODUK.includes(produk)) {
      throw new Error(
        `Pemanfaatan produk tidak valid. Nilai valid: ${VALID_PEMANFAATAN_PRODUK.join(
          ", "
        )}.`
      );
    }
  }
};

const addUsahaKlengkeng = async (data: IUsahaKlengkeng | IUsahaKlengkeng[]) => {
  const dataArray = Array.isArray(data) ? data : [data];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    for (const item of dataArray) {
      validateUsahaKlengkengData(item);
      const sls = await Sls.findOne({ kode: item.kodeSls }).session(session);
      if (!sls) {
        throw new Error(
          `SLS dengan kode ${item.kodeSls} tidak ditemukan. Pastikan kode SLS yang dimasukkan benar.`
        );
      }
    }

    const newUsahaKlengkeng = await UsahaKlengkeng.insertMany(dataArray, {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    await updateAllSlsAggregates();

    return newUsahaKlengkeng;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Logging kesalahan
    if (error instanceof Error) {
      console.error(`Gagal menyimpan usaha kelengkeng: ${error.message}`);
      throw new Error(`Gagal menyimpan usaha kelengkeng: ${error.message}`);
    } else {
      console.error("Gagal menyimpan usaha kelengkeng: Unknown error");
      throw new Error("Gagal menyimpan usaha kelengkeng: Unknown error");
    }
  }
};

const updateUsahaKlengkeng = async (kode: string, data: IUsahaKlengkeng) => {
  validateUsahaKlengkengData(data);

  const upadtedUsahaKlengkeng = await UsahaKlengkeng.findOneAndUpdate(
    { kode },
    data,
    { new: true }
  );
  if (upadtedUsahaKlengkeng) {
    await updateAllSlsAggregates();
  } else {
    throw new Error("Usaha klengkeng tidak ditemukan.");
  }

  return upadtedUsahaKlengkeng;
};

const deleteUsahaKlengkeng = async (kode: string) => {
  const deletedUsahaKlengkeng = await UsahaKlengkeng.findOneAndDelete({ kode });
  if (deletedUsahaKlengkeng) {
    await updateAllSlsAggregates();
  } else {
    throw new Error("Usaha klengkeng tidak ditemukan.");
  }

  return deletedUsahaKlengkeng;
};

const getUsahaKlengkengByKode = async (kode: string) => {
  const usahaKlengkeng = await UsahaKlengkeng.findOne({ kode });
  if (!usahaKlengkeng) {
    throw new Error("Usaha klengkeng tidak ditemukan.");
  }
  return usahaKlengkeng;
};

const getAllUsahaKlengkeng = async () => {
  return await UsahaKlengkeng.find().sort({ kode: 1 });
};

export default {
  addUsahaKlengkeng,
  updateUsahaKlengkeng,
  deleteUsahaKlengkeng,
  getUsahaKlengkengByKode,
  getAllUsahaKlengkeng,
};
