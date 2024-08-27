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

    // Validasi dan pencarian SLS
    for (const item of dataArray) {
      validateUsahaKlengkengData(item);
      const sls = await Sls.findOne({ kode: item.kodeSls }).session(session);
      if (!sls) {
        throw new Error(
          `SLS dengan kode ${item.kodeSls} tidak ditemukan. Pastikan kode SLS yang dimasukkan benar.`
        );
      }
    }

    // Menentukan kode usaha baru
    for (const item of dataArray) {
      // Periksa dan pastikan tidak ada duplikasi kode
      const existingUsaha = await UsahaKlengkeng.findOne({
        kode: item.kode,
      }).session(session);
      if (existingUsaha) {
        throw new Error(`Kode usaha ${item.kode} sudah ada.`);
      }

      // Generate kode usaha baru jika belum ada
      let highestCode = await UsahaKlengkeng.findOne({
        kode: new RegExp(`^${item.kodeSls}`),
      })
        .sort({ kode: -1 })
        .session(session);

      // Tentukan nomor urut berikutnya
      let nextNumber = 1;
      if (highestCode) {
        const highestNumber = parseInt(
          highestCode.kode.slice(item.kodeSls.length),
          10
        );
        nextNumber = highestNumber + 1;
      }

      // Format nomor urut dengan tiga digit
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      item.kode = `${item.kodeSls}${formattedNumber}`;
    }

    // Simpan data usaha kelengkeng ke database
    const newUsahaKlengkeng = await UsahaKlengkeng.insertMany(dataArray, {
      session,
    });

    // Verifikasi dan perbaiki urutan kode untuk setiap kodeSls
    const kodeSlsList = Array.from(
      new Set(dataArray.map((item) => item.kodeSls))
    );

    for (const kodeSls of kodeSlsList) {
      const usahaList = await UsahaKlengkeng.find({
        kode: new RegExp(`^${kodeSls}`),
      })
        .sort({ kode: 1 })
        .session(session);

      // Perbaiki kode jika ada duplikasi atau kesalahan urutan
      const bulkOps = usahaList
        .map((usaha, index) => {
          const correctKode = `${kodeSls}${(index + 1)
            .toString()
            .padStart(3, "0")}`;
          if (usaha.kode !== correctKode) {
            return {
              updateOne: {
                filter: { _id: usaha._id },
                update: { $set: { kode: correctKode } },
              },
            };
          }
          return null;
        })
        .filter((op) => op !== null);

      if (bulkOps.length > 0) {
        await UsahaKlengkeng.bulkWrite(bulkOps, { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Update agregat SLS setelah menyimpan data
    await updateAllSlsAggregates();

    return [];
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

const updateUsahaKlengkeng = async (
  id: mongoose.Types.ObjectId,
  data: IUsahaKlengkeng
) => {
  validateUsahaKlengkengData(data);

  const updatedUsahaKlengkeng = await UsahaKlengkeng.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
  if (updatedUsahaKlengkeng) {
    await updateAllSlsAggregates();
  } else {
    throw new Error("Usaha klengkeng tidak ditemukan.");
  }

  return updatedUsahaKlengkeng;
};

const ensureSequentialKode = async (
  kodeSls: string,
  session: mongoose.ClientSession
) => {
  const usahaList = await UsahaKlengkeng.find({
    kode: new RegExp(`^${kodeSls}`),
  })
    .sort({ kode: 1 })
    .session(session);

  const bulkOps = usahaList
    .map((usaha, index) => {
      const correctKode = `${kodeSls}${(index + 1)
        .toString()
        .padStart(3, "0")}`;
      if (usaha.kode !== correctKode) {
        return {
          updateOne: {
            filter: { _id: usaha._id },
            update: { $set: { kode: correctKode } },
          },
        };
      }
      return null;
    })
    .filter((op) => op !== null);

  if (bulkOps.length > 0) {
    await UsahaKlengkeng.bulkWrite(bulkOps, { session });
  }
};

const deleteUsahaKlengkeng = async (id: mongoose.Types.ObjectId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const usahaToDelete = await UsahaKlengkeng.findById(id).session(session);
    if (!usahaToDelete) {
      throw new Error("Usaha klengkeng tidak ditemukan.");
    }

    // Hapus usaha klengkeng
    await UsahaKlengkeng.findByIdAndDelete(id).session(session);

    // Perbarui kode usaha untuk kodeSls yang sama
    await ensureSequentialKode(usahaToDelete.kode.slice(0, -3), session);

    // Commit transaksi
    await session.commitTransaction();
    session.endSession();

    // Update agregat SLS setelah menyimpan data
    await updateAllSlsAggregates();

    return usahaToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Logging kesalahan
    if (error instanceof Error) {
      console.error(`Gagal menghapus usaha kelengkeng: ${error.message}`);
      throw new Error(`Gagal menghapus usaha kelengkeng: ${error.message}`);
    } else {
      console.error("Gagal menghapus usaha kelengkeng: Unknown error");
      throw new Error("Gagal menghapus usaha kelengkeng: Unknown error");
    }
  }
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
