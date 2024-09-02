import mongoose, { Document, Schema } from "mongoose";
import usahaKlengkengModel from "../models/usahaKlengkengModel";
import slsModel from "../models/slsModel";

// Fungsi untuk memperbarui agregat semua SLS
async function updateAllSlsAggregates(): Promise<void> {
  try {
    // Ambil seluruh kode SLS yang ada dari koleksi Sls
    const slsList = await slsModel.find({}, { kode: 1 });

    // Loop melalui setiap kode SLS dan lakukan agregasi
    for (const sls of slsList) {
      const slsKode = sls.kode;

      // Agregasi data dari koleksi UsahaKlengkeng untuk kode SLS saat ini
      const aggregationResult = await usahaKlengkengModel.aggregate([
        {
          $match: { kodeSls: slsKode }, // Cocokkan kodeSls
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
            jenisPupukCounts: {
              $push: "$jenis_pupuk",
            },
            pemanfaatanProdukCounts: {
              $push: "$pemanfaatan_produk",
            },
          },
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
            jenisPupukCounts: {
              organik: {
                $size: {
                  $filter: {
                    input: "$jenisPupukCounts",
                    as: "pupuk",
                    cond: { $in: ["organik", "$$pupuk"] },
                  },
                },
              },
              anorganik: {
                $size: {
                  $filter: {
                    input: "$jenisPupukCounts",
                    as: "pupuk",
                    cond: { $in: ["anorganik", "$$pupuk"] },
                  },
                },
              },
              tidak_ada_pupuk: {
                $size: {
                  $filter: {
                    input: "$jenisPupukCounts",
                    as: "pupuk",
                    cond: { $in: ["tidak_ada_pupuk", "$$pupuk"] },
                  },
                },
              },
            },
            pemanfaatanProdukCounts: {
              kopi_biji_klengkeng: {
                $size: {
                  $filter: {
                    input: "$pemanfaatanProdukCounts",
                    as: "produk",
                    cond: { $in: ["kopi_biji_klengkeng", "$$produk"] },
                  },
                },
              },
              kerajinan_tangan: {
                $size: {
                  $filter: {
                    input: "$pemanfaatanProdukCounts",
                    as: "produk",
                    cond: { $in: ["kerajinan_tangan", "$$produk"] },
                  },
                },
              },
              batik_ecoprint: {
                $size: {
                  $filter: {
                    input: "$pemanfaatanProdukCounts",
                    as: "produk",
                    cond: { $in: ["batik_ecoprint", "$$produk"] },
                  },
                },
              },
              minuman: {
                $size: {
                  $filter: {
                    input: "$pemanfaatanProdukCounts",
                    as: "produk",
                    cond: { $in: ["minuman", "$$produk"] },
                  },
                },
              },
              makanan: {
                $size: {
                  $filter: {
                    input: "$pemanfaatanProdukCounts",
                    as: "produk",
                    cond: { $in: ["makanan", "$$produk"] },
                  },
                },
              },
              tidak_dimanfaatkan: {
                $size: {
                  $filter: {
                    input: "$pemanfaatanProdukCounts",
                    as: "produk",
                    cond: { $in: ["tidak_dimanfaatkan", "$$produk"] },
                  },
                },
              },
            },
          },
        },
      ]);

      // Jika tidak ada data agregat ditemukan, set semua nilai menjadi 0
      const aggregatedData =
        aggregationResult.length > 0
          ? aggregationResult[0]
          : {
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
              jenisPupukCounts: {
                organik: 0,
                anorganik: 0,
                tidak_ada_pupuk: 0,
              },
              pemanfaatanProdukCounts: {
                kopi_biji_klengkeng: 0,
                kerajinan_tangan: 0,
                batik_ecoprint: 0,
                minuman: 0,
                makanan: 0,
                tidak_dimanfaatkan: 0,
              },
            };

      // Update data agregat di koleksi Sls
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
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pupuk_organik": aggregatedData.jenisPupukCounts.organik,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pupuk_anorganik": aggregatedData.jenisPupukCounts.anorganik,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_tidak_ada_pupuk": aggregatedData.jenisPupukCounts.tidak_ada_pupuk,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_kopi_biji_klengkeng": aggregatedData.pemanfaatanProdukCounts.kopi_biji_klengkeng,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_kerajinan_tangan": aggregatedData.pemanfaatanProdukCounts.kerajinan_tangan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_batik_ecoprint": aggregatedData.pemanfaatanProdukCounts.batik_ecoprint,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_minuman": aggregatedData.pemanfaatanProdukCounts.minuman,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_makanan": aggregatedData.pemanfaatanProdukCounts.makanan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_tidak_dimanfaatkan": aggregatedData.pemanfaatanProdukCounts.tidak_dimanfaatkan,
          },
        },
        { arrayFilters: [{ "elem.properties.kode": slsKode }] }
      );
    }
  } catch (error) {
    console.error("Error updating SLS aggregate data:", error);
  }
}

export default updateAllSlsAggregates;
