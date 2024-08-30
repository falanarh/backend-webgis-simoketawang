import usahaKlengkengModel from '../models/usahaKlengkengModel';
import slsModel from '../models/slsModel';

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
          $match: { kodeSls: slsKode } // Cocokkan kodeSls
        },
        {
          $group: {
            _id: "$kodeSls",
            totalUsaha: { $sum: 1 },
            kategoriUsahaCounts: {
              $push: {
                jenis_klengkeng: "$jenis_klengkeng",
                jenis_pupuk: "$jenis_pupuk",
                pemanfaatan_produk: "$pemanfaatan_produk"
              }
            },
            totalPohon: { $sum: "$jml_pohon" },
            totalPohonBlmBerproduksi: { $sum: "$jml_pohon_blm_berproduksi" },
            totalPohonSdhBerproduksi: { $sum: "$jml_pohon_sdh_berproduksi" }
          }
        },
        {
          $project: {
            _id: 0,
            totalUsaha: 1,
            kategoriUsahaCounts: {
              $arrayToObject: {
                $map: {
                  input: [
                    "new_crystal", "pingpong", "matalada", "diamond_river", "merah"
                  ],
                  as: "jenis",
                  in: {
                    k: "$$jenis",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $eq: ["$$item.jenis_klengkeng", "$$jenis"] }
                        }
                      }
                    }
                  }
                }
              }
            },
            jenisPupukCounts: {
              $arrayToObject: {
                $map: {
                  input: ["organik", "anorganik", "tidak_ada_pupuk"],
                  as: "pupuk",
                  in: {
                    k: "$$pupuk",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $eq: ["$$item.jenis_pupuk", "$$pupuk"] }
                        }
                      }
                    }
                  }
                }
              }
            },
            pemanfaatanProdukCounts: {
              $arrayToObject: {
                $map: {
                  input: ["kopi_biji_klengkeng", "kerajinan_tangan", "batik_ecoprint", "minuman", "makanan"],
                  as: "produk",
                  in: {
                    k: "$$produk",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $in: ["$$produk", "$$item.pemanfaatan_produk"] }
                        }
                      }
                    }
                  }
                }
              }
            },
            totalPohon: 1,
            totalPohonBlmBerproduksi: 1,
            totalPohonSdhBerproduksi: 1
          }
        }
      ]);

      // Jika tidak ada data agregat ditemukan, set semua nilai menjadi 0
      const aggregatedData = aggregationResult.length > 0 ? aggregationResult[0] : {
        totalUsaha: 0,
        kategoriUsahaCounts: {
          new_crystal: 0,
          pingpong: 0,
          matalada: 0,
          diamond_river: 0,
          merah: 0
        },
        jenisPupukCounts: {
          organik: 0,
          anorganik: 0,
          tidak_ada_pupuk: 0
        },
        pemanfaatanProdukCounts: {
          kopi_biji_klengkeng: 0,
          kerajinan_tangan: 0,
          batik_ecoprint: 0,
          minuman: 0,
          makanan: 0
        },
        totalPohon: 0,
        totalPohonBlmBerproduksi: 0,
        totalPohonSdhBerproduksi: 0
      };

      // Update data agregat di koleksi Sls
      await slsModel.updateOne(
        { "geojson.features.properties.kode": slsKode },
        {
          $set: {
            "geojson.features.$.properties.jml_unit_usaha_klengkeng": aggregatedData.totalUsaha,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_new_crystal": aggregatedData.kategoriUsahaCounts.new_crystal,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pingpong": aggregatedData.kategoriUsahaCounts.pingpong,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_matalada": aggregatedData.kategoriUsahaCounts.matalada,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_diamond_river": aggregatedData.kategoriUsahaCounts.diamond_river,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_merah": aggregatedData.kategoriUsahaCounts.merah,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pupuk_organik": aggregatedData.jenisPupukCounts.organik,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pupuk_anorganik": aggregatedData.jenisPupukCounts.anorganik,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_tidak_ada_pupuk": aggregatedData.jenisPupukCounts.tidak_ada_pupuk,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_kopi_biji_klengkeng": aggregatedData.pemanfaatanProdukCounts.kopi_biji_klengkeng,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_kerajinan_tangan": aggregatedData.pemanfaatanProdukCounts.kerajinan_tangan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_batik_ecoprint": aggregatedData.pemanfaatanProdukCounts.batik_ecoprint,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_minuman": aggregatedData.pemanfaatanProdukCounts.minuman,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_makanan": aggregatedData.pemanfaatanProdukCounts.makanan,
            "geojson.features.$.properties.jml_pohon": aggregatedData.totalPohon,
            "geojson.features.$.properties.jml_pohon_blm_berproduksi": aggregatedData.totalPohonBlmBerproduksi,
            "geojson.features.$.properties.jml_pohon_sdh_berproduksi": aggregatedData.totalPohonSdhBerproduksi
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
