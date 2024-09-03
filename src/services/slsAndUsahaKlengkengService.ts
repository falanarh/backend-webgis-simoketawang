import mongoose from "mongoose";
import usahaKlengkengModel from "../models/usahaKlengkengModel";
import slsModel from "../models/slsModel";

// Fungsi untuk memperbarui agregat semua SLS
async function updateAllSlsAggregates(): Promise<void> {
  try {
    console.log("Memulai proses pembaruan agregat SLS...");

    // Ambil seluruh kode SLS yang ada dari koleksi Sls
    const slsList = await slsModel.find({}, { kode: 1 });
    console.log(`Ditemukan ${slsList.length} SLS untuk diperbarui.`);

    for (const sls of slsList) {
      const slsKode = sls.kode;
      console.log(`Memproses SLS dengan kode: ${slsKode}`);

      // Agregasi data dari koleksi UsahaKlengkeng untuk kode SLS saat ini
      const aggregationResult = await usahaKlengkengModel.aggregate([
        {
          $match: { kodeSls: slsKode },
        },
        {
          $group: {
            _id: {
              kodeSls: "$kodeSls",
              jenis_pupuk: "$jenis_pupuk",
              pemanfaatan_produk: "$pemanfaatan_produk",
            },
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
      ]);

      console.log(`Ditemukan ${aggregationResult.length} hasil agregasi untuk SLS ${slsKode}.`);

      // Persiapan data akhir untuk update ke SLS
      const aggregatedData = {
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

      for (const data of aggregationResult) {
        aggregatedData.totalUsaha += data.totalUsaha;
        aggregatedData.totalPohon += data.totalPohon;
        aggregatedData.totalPohonNewCrystal += data.totalPohonNewCrystal;
        aggregatedData.totalPohonPingpong += data.totalPohonPingpong;
        aggregatedData.totalPohonMetalada += data.totalPohonMetalada;
        aggregatedData.totalPohonDiamondRiver += data.totalPohonDiamondRiver;
        aggregatedData.totalPohonMerah += data.totalPohonMerah;
        aggregatedData.totalPohonBlmBerproduksi += data.totalPohonBlmBerproduksi;
        aggregatedData.totalPohonSdhBerproduksi += data.totalPohonSdhBerproduksi;
        aggregatedData.totalVolumeProduksi += data.totalVolumeProduksi;

        // Hitung jenis pupuk
        if (data._id.jenis_pupuk.includes("organik")) {
          aggregatedData.jenisPupukCounts.organik++;
        }
        if (data._id.jenis_pupuk.includes("anorganik")) {
          aggregatedData.jenisPupukCounts.anorganik++;
        }
        if (data._id.jenis_pupuk.includes("tidak_ada_pupuk")) {
          aggregatedData.jenisPupukCounts.tidak_ada_pupuk++;
        }

        // Hitung pemanfaatan produk
        if (data._id.pemanfaatan_produk.includes("kopi_biji_klengkeng")) {
          aggregatedData.pemanfaatanProdukCounts.kopi_biji_klengkeng++;
        }
        if (data._id.pemanfaatan_produk.includes("kerajinan_tangan")) {
          aggregatedData.pemanfaatanProdukCounts.kerajinan_tangan++;
        }
        if (data._id.pemanfaatan_produk.includes("batik_ecoprint")) {
          aggregatedData.pemanfaatanProdukCounts.batik_ecoprint++;
        }
        if (data._id.pemanfaatan_produk.includes("minuman")) {
          aggregatedData.pemanfaatanProdukCounts.minuman++;
        }
        if (data._id.pemanfaatan_produk.includes("makanan")) {
          aggregatedData.pemanfaatanProdukCounts.makanan++;
        }
        if (data._id.pemanfaatan_produk.includes("tidak_dimanfaatkan")) {
          aggregatedData.pemanfaatanProdukCounts.tidak_dimanfaatkan++;
        }
      }

      console.log(`Data agregasi yang telah dihitung untuk SLS ${slsKode}:`, aggregatedData);

      // Update data di SLS
      const updateResult = await slsModel.updateOne(
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
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pemanfaatan_kopi_biji_klengkeng": aggregatedData.pemanfaatanProdukCounts.kopi_biji_klengkeng,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pemanfaatan_kerajinan_tangan": aggregatedData.pemanfaatanProdukCounts.kerajinan_tangan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pemanfaatan_batik_ecoprint": aggregatedData.pemanfaatanProdukCounts.batik_ecoprint,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pemanfaatan_minuman": aggregatedData.pemanfaatanProdukCounts.minuman,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pemanfaatan_makanan": aggregatedData.pemanfaatanProdukCounts.makanan,
            "geojson.features.$.properties.jml_unit_usaha_klengkeng_pemanfaatan_tidak_dimanfaatkan": aggregatedData.pemanfaatanProdukCounts.tidak_dimanfaatkan,
          },
        }
      );

      console.log(`Hasil update untuk SLS ${slsKode}:`, updateResult);
    }

    console.log("Agregasi SLS berhasil diperbarui.");
  } catch (error) {
    console.error("Terjadi kesalahan saat memperbarui agregasi SLS:", error);
  }
}

export default updateAllSlsAggregates;
