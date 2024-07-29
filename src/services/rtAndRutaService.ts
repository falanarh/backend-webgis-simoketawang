import RumahTangga from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";

export const updateAllRtData = async () => {
    console.log("Updating data for all RTs");

    // Ambil seluruh data RumahTangga
    const rtData = await RumahTangga.find({});
    console.log(`Jumlah RumahTangga: ${rtData.length}`);

    // Menghitung agregasi per kodeRt
    const aggregation = await RumahTangga.aggregate([
        {
            $group: {
                _id: "$kodeRt",
                jml_umkm: { $sum: 1 },
                jml_umkm_tetap: {
                    $sum: {
                        $cond: [{ $eq: ["$jenisUmkm", "tetap"] }, 1, 0]
                    }
                },
                jml_umkm_nontetap: {
                    $sum: {
                        $cond: [{ $eq: ["$jenisUmkm", "nontetap"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_a: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_a"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_b: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_b"] }, 1, 0]
                    }
                },
                // ... Tambahkan semua klasifikasi kbli sesuai kebutuhan
                jml_umkm_kbli_u: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_u"] }, 1, 0]
                    }
                },
            },
        },
    ]);

    if (!aggregation || aggregation.length === 0) {
        console.error("No aggregation results");
        return;
    }

    // Memperbarui data RT dengan hasil agregasi
    for (const item of aggregation) {
        const {
            _id: kodeRt,
            jml_umkm,
            jml_umkm_tetap,
            jml_umkm_nontetap,
            jml_umkm_kbli_a,
            jml_umkm_kbli_b,
            jml_umkm_kbli_c,
            jml_umkm_kbli_d,
            jml_umkm_kbli_e,
            jml_umkm_kbli_f,
            jml_umkm_kbli_g,
            jml_umkm_kbli_h,
            jml_umkm_kbli_i,
            jml_umkm_kbli_j,
            jml_umkm_kbli_k,
            jml_umkm_kbli_l,
            jml_umkm_kbli_m,
            jml_umkm_kbli_n,
            jml_umkm_kbli_o,
            jml_umkm_kbli_p,
            jml_umkm_kbli_q,
            jml_umkm_kbli_r,
            jml_umkm_kbli_s,
            jml_umkm_kbli_t,
            jml_umkm_kbli_u,
        } = item;

        const updatedRt = await Rt.findOneAndUpdate(
            { kode: kodeRt },
            {
                $set: {
                    "geojson.features.$[elem].properties.jml_umkm": jml_umkm,
                    "geojson.features.$[elem].properties.jml_umkm_tetap": jml_umkm_tetap,
                    "geojson.features.$[elem].properties.jml_umkm_nontetap": jml_umkm_nontetap,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_a": jml_umkm_kbli_a,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_b": jml_umkm_kbli_b,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_c": jml_umkm_kbli_c,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_d": jml_umkm_kbli_d,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_e": jml_umkm_kbli_e,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_f": jml_umkm_kbli_f,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_g": jml_umkm_kbli_g,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_h": jml_umkm_kbli_h,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_i": jml_umkm_kbli_i,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_j": jml_umkm_kbli_j,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_k": jml_umkm_kbli_k,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_l": jml_umkm_kbli_l,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_m": jml_umkm_kbli_m,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_n": jml_umkm_kbli_n,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_o": jml_umkm_kbli_o,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_p": jml_umkm_kbli_p,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_q": jml_umkm_kbli_q,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_r": jml_umkm_kbli_r,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_s": jml_umkm_kbli_s,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_t": jml_umkm_kbli_t,
                    "geojson.features.$[elem].properties.jml_umkm_kbli_u": jml_umkm_kbli_u,
                },
            },
            {
                arrayFilters: [{ "elem.properties.kode": kodeRt }],
                new: true
            }
        );

        if (!updatedRt) {
            console.error(`Failed to update Rt data for RT ${kodeRt}`);
        } else {
            console.log(`Successfully updated data for RT ${kodeRt}`);
        }
    }
};
