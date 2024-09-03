import mongoose from "mongoose";
import usahaKlengkengModel from "../models/usahaKlengkengModel";
import slsModel from "../models/slsModel";

// Fungsi untuk memperbarui agregat semua SLS
async function updateAllSlsAggregates(): Promise<void> {
  try {
    // Ambil seluruh kode SLS yang ada dari koleksi Sls
    const slsList = await slsModel.find({}, { kode: 1 });

    for (const sls of slsList) {
      const slsKode = sls.kode;

      // Agregasi data dari koleksi UsahaKlengkeng untuk kode SLS saat ini
      const aggregationResult = await usahaKlengkengModel.aggregate([
        {
          $match: { kodeSls: slsKode },
        },
        {
          $group: {
            _id: "$kodeSls",
            totalUsaha: { $sum: 1 },
            totalPohon: { $sum: "$jml_pohon" },
            totalPohonNewCrystal: { $sum: "$jml_pohon_new_crystal" },
            totalPohonPingpong: { $sum: "$jml_pohon_pingpong" },
            totalPohonMetalada: { $sum: "$jml_pohon_metalada" },
            totalPohonDiamondRiver: { $sum: "$jml_pohon_diamond_river" },
            totalPohonMerah: { $sum: "$jml_pohon_merah" },
            totalPohonBlmBerproduksi: { $sum: "$jml_pohon_blm_berproduksi" },
            totalPohonSdhBerproduksi: { $sum: "$jml_pohon_sdh_berproduksi" },
            totalVolumeProduksi: { $sum: "$volume_produksi" },
          },
        },
        {
          $lookup: {
            from: "usahaklengkengs",
            let: { kodeSls: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$kodeSls", "$$kodeSls"] } } },
              { $unwind: "$jenis_pupuk" },
              {
                $group: {
                  _id: "$jenis_pupuk",
                  count: { $sum: 1 }
                }
              },
              {
                $group: {
                  _id: null,
                  jenisPupuk: {
                    $push: { k: "$_id", v: "$count" }
                  }
                }
              }
            ],
            as: "jenisPupukAggregate",
          }
        },
        {
          $lookup: {
            from: "usahaklengkengs",
            let: { kodeSls: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$kodeSls", "$$kodeSls"] } } },
              { $unwind: "$pemanfaatan_produk" },
              {
                $group: {
                  _id: "$pemanfaatan_produk",
                  count: { $sum: 1 }
                }
              },
              {
                $group: {
                  _id: null,
                  pemanfaatanProduk: {
                    $push: { k: "$_id", v: "$count" }
                  }
                }
              }
            ],
            as: "pemanfaatanProdukAggregate",
          }
        },
        {
          $project: {
            _id: 0,
            totalUsaha: 1,
            totalPohon: 1,
            totalPohonNewCrystal: 1,
            totalPohonPingpong: 1,
            totalPohonMetalada: 1,
            totalPohonDiamondRiver: 1,
            totalPohonMerah: 1,
            totalPohonBlmBerproduksi: 1,
            totalPohonSdhBerproduksi: 1,
            totalVolumeProduksi: 1,
            jenisPupukAggregate: { $arrayElemAt: ["$jenisPupukAggregate.jenisPupuk", 0] },
            pemanfaatanProdukAggregate: { $arrayElemAt: ["$pemanfaatanProdukAggregate.pemanfaatanProduk", 0] },
          }
        }
      ]);

      const aggregatedData = aggregationResult.length > 0 ? aggregationResult[0] : {
        totalUsaha: 0,
        totalPohon: 0,
        totalPohonNewCrystal: 0,
        totalPohonPingpong: 0,
        totalPohonMetalada: 0,
        totalPohonDiamondRiver: 0,
        totalPohonMerah: 0,
        totalPohonBlmBerproduksi: 0,
        totalPohonSdhBerproduksi: 0,
        totalVolumeProduksi: 0,
        jenisPupukAggregate: [],
        pemanfaatanProdukAggregate: [],
      };

      const jenisPupuk = aggregatedData.jenisPupukAggregate.reduce((acc: any, curr: any) => {
        acc[curr.k] = curr.v;
        return acc;
      }, {});

      const pemanfaatanProduk = aggregatedData.pemanfaatanProdukAggregate.reduce((acc: any, curr: any) => {
        acc[curr.k] = curr.v;
        return acc;
      }, {});

      // Menyimpan nilai total berdasarkan jenis pupuk
      const totalPupukOrganik = jenisPupuk["organik"] || 0;
      const totalPupukAnorganik = jenisPupuk["anorganik"] || 0;
      const totalTidakAdaPupuk = jenisPupuk["tidak_ada_pupuk"] || 0;

      // Menyimpan nilai total berdasarkan pemanfaatan produk
      const totalKopiBijiKelengkeng = pemanfaatanProduk["kopi_biji_klengkeng"] || 0;
      const totalKerajinanTangan = pemanfaatanProduk["kerajinan_tangan"] || 0;
      const totalBatikEcoprint = pemanfaatanProduk["batik_ecoprint"] || 0;
      const totalMinuman = pemanfaatanProduk["minuman"] || 0;
      const totalMakanan = pemanfaatanProduk["makanan"] || 0;
      const totalTidakDimanfaatkan = pemanfaatanProduk["tidak_dimanfaatkan"] || 0;

      // console.log("Kode SLS:", slsKode);
      // console.log("Aggregated Data:", aggregatedData);
      // console.log("Jenis Pupuk:", jenisPupuk);
      // console.log("Pemanfaatan Produk:", pemanfaatanProduk);

      await slsModel.updateOne(
        { "geojson.features.properties.kode": slsKode },
        {
          $set: {
            "geojson.features.$.properties.jml_pohon": aggregatedData.totalPohon,
            "geojson.features.$.properties.jml_pohon_new_crystal": aggregatedData.totalPohonNewCrystal,
            "geojson.features.$.properties.jml_pohon_pingpong": aggregatedData.totalPohonPingpong,
            "geojson.features.$.properties.jml_pohon_metalada": aggregatedData.totalPohonMetalada,
            "geojson.features.$.properties.jml_pohon_diamond_river": aggregatedData.totalPohonDiamondRiver,
            "geojson.features.$.properties.jml_pohon_merah": aggregatedData.totalPohonMerah,
            "geojson.features.$.properties.jml_pohon_blm_berproduksi": aggregatedData.totalPohonBlmBerproduksi,
            "geojson.features.$.properties.jml_pohon_sdh_berproduksi": aggregatedData.totalPohonSdhBerproduksi,
            "geojson.features.$.properties.volume_produksi": aggregatedData.totalVolumeProduksi,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng": aggregatedData.totalUsaha,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pupuk_organik": totalPupukOrganik,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pupuk_anorganik": totalPupukAnorganik,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_tidak_ada_pupuk": totalTidakAdaPupuk,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_kopi_biji_klengkeng": totalKopiBijiKelengkeng,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_kerajinan_tangan": totalKerajinanTangan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_batik_ecoprint": totalBatikEcoprint,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_minuman": totalMinuman,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_makanan": totalMakanan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_tidak_dimanfaatkan": totalTidakDimanfaatkan,
          },
        }
      );
    }

    console.log("Agregasi SLS berhasil diperbarui.");
  } catch (error) {
    console.error("Terjadi kesalahan saat memperbarui agregasi SLS:", error);
  }
}

export default updateAllSlsAggregates;
