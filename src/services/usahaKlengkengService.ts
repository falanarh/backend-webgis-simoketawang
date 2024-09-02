import { IUsahaKlengkeng } from "../models/usahaKlengkengModel";
import Sls from "../models/slsModel";
import UsahaKlengkeng from "../models/usahaKlengkengModel";
import mongoose from "mongoose";
import updateAllSlsAggregates from "./slsAndUsahaKlengkengService";

const VALID_JENIS_PUPUK = ["organik", "anorganik", "tidak_ada_pupuk"];

const VALID_PEMANFAATAN_PRODUK = [
  "kopi_biji_klengkeng",
  "kerajinan_tangan",
  "batik_ecoprint",
  "minuman",
  "makanan",
];

const validateUsahaKlengkengData = (data: IUsahaKlengkeng) => {
  for (const pupuk of data.jenis_pupuk) {
    if (!VALID_JENIS_PUPUK.includes(pupuk)) {
      throw new Error(
        `Jenis pupuk tidak valid. Nilai valid: 'organik', 'anorganik', 'tidak_ada_pupuk'.`
      );
    }
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
  
  const totalPohon = data.jml_pohon_new_crystal + data.jml_pohon_pingpong + data.jml_pohon_metalada + data.jml_pohon_diamond_river + data.jml_pohon_merah;

  if (totalPohon !== data.jml_pohon) {
    throw new Error(
      `Jumlah pohon tidak sesuai. Total pohon (${totalPohon}) harus sama dengan jml_pohon (${data.jml_pohon}).`
    );
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

const generateNextCode = async (kodeSls: string): Promise<string> => {
  const latestEntry = await UsahaKlengkeng.findOne({ kodeSls })
    .sort({ kode: -1 }) // Sort in descending order to get the latest entry
    .exec();

  if (latestEntry) {
    const latestCode = latestEntry.kode;
    const sequenceNumber = parseInt(latestCode.slice(-3), 10) + 1;
    return `${kodeSls}${sequenceNumber.toString().padStart(3, "0")}`;
  } else {
    return `${kodeSls}001`; // Starting code if no previous entries exist
  }
};

const updateKode = async (kodeSls: string) => {
  const entries = await UsahaKlengkeng.find({ kodeSls })
    .sort({ kode: 1 })
    .exec();

  for (const [index, entry] of entries.entries()) {
    const newCode = `${kodeSls}${(index + 1).toString().padStart(3, "0")}`;
    entry.kode = newCode;
    await entry.save();
  }
};

const deleteManyUsahaKlengkeng = async (ids: string[]) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!Array.isArray(ids)) {
      throw new Error("The request body must be an array.");
    }

    let kodeSlsList: string[] = [];

    if (ids.includes("all")) {
      // Handle deletion of all entries
      const allEntries = await UsahaKlengkeng.find({});
      kodeSlsList = [...new Set(allEntries.map((entry) => entry.kodeSls))];
      await UsahaKlengkeng.deleteMany({}).session(session);
    } else {
      const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (validIds.length === 0) {
        throw new Error("No valid IDs provided.");
      }

      const objectIds = validIds.map((id) => new mongoose.Types.ObjectId(id));
      const deletedEntries = await UsahaKlengkeng.find({
        _id: { $in: objectIds },
      }).session(session);
      kodeSlsList = [...new Set(deletedEntries.map((entry) => entry.kodeSls))];
      const result = await UsahaKlengkeng.deleteMany({
        _id: { $in: objectIds },
      }).session(session);

      if (result.deletedCount === 0) {
        throw new Error("No UsahaKlengkeng found with the provided IDs.");
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Update aggregate SLS after deletion
    await updateAllSlsAggregates();

    // Reorder codes for all affected `kodeSls`
    for (const kodeSls of kodeSlsList) {
      await updateKode(kodeSls);
    }

    return { deletedCount: ids.length };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Logging errors
    if (error instanceof Error) {
      console.error(`Failed to delete usaha klengkeng: ${error.message}`);
      throw new Error(`Failed to delete usaha klengkeng: ${error.message}`);
    } else {
      console.error("Failed to delete usaha klengkeng: Unknown error");
      throw new Error("Failed to delete usaha klengkeng: Unknown error");
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
  deleteManyUsahaKlengkeng,
  getUsahaKlengkengByKode,
  getAllUsahaKlengkeng,
};
