import RumahTangga from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";

export const updateRtData = async (kodeRt: string) => {
    console.log(`Updating data for RT: ${kodeRt}`);

    // Debug: log the current Rt data
    const rtData = await RumahTangga.find({ kodeRt: kodeRt });
    console.log(`Jumlah RumahTangga for RT ${kodeRt}:`, rtData.length);

    // Hitung total UMKM dan kategori UMKM
    const aggregation = await RumahTangga.aggregate([
        { $match: { kodeRt: kodeRt } },
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
                jml_umkm_kbli_c: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_c"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_d: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_d"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_e: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_e"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_f: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_f"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_g: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_g"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_h: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_h"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_i: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_i"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_j: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_j"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_k: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_k"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_l: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_l"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_m: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_m"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_n: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_n"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_o: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_o"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_p: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_p"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_q: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_q"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_r: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_r"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_s: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_s"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_t: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_t"] }, 1, 0]
                    }
                },
                jml_umkm_kbli_u: {
                    $sum: {
                        $cond: [{ $eq: ["$klasifikasiKbli", "kbli_u"] }, 1, 0]
                    }
                },
            },
        },
    ]);

    if (!aggregation || aggregation.length === 0) {
        console.error(`No aggregation results for RT ${kodeRt}`);
        return;
    }

    const {
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
    } = aggregation[0];

    // Update Rt data with the new values
    const updatedRt = await Rt.findOneAndUpdate(
        { kode: kodeRt },
        {
            $set: {
                "geojson.properties.jml_umkm": jml_umkm,
                "geojson.properties.jml_umkm_tetap": jml_umkm_tetap,
                "geojson.properties.jml_umkm_nontetap": jml_umkm_nontetap,
                "geojson.properties.jml_umkm_kbli_a": jml_umkm_kbli_a,
                "geojson.properties.jml_umkm_kbli_b": jml_umkm_kbli_b,
                "geojson.properties.jml_umkm_kbli_c": jml_umkm_kbli_c,
                "geojson.properties.jml_umkm_kbli_d": jml_umkm_kbli_d,
                "geojson.properties.jml_umkm_kbli_e": jml_umkm_kbli_e,
                "geojson.properties.jml_umkm_kbli_f": jml_umkm_kbli_f,
                "geojson.properties.jml_umkm_kbli_g": jml_umkm_kbli_g,
                "geojson.properties.jml_umkm_kbli_h": jml_umkm_kbli_h,
                "geojson.properties.jml_umkm_kbli_i": jml_umkm_kbli_i,
                "geojson.properties.jml_umkm_kbli_j": jml_umkm_kbli_j,
                "geojson.properties.jml_umkm_kbli_k": jml_umkm_kbli_k,
                "geojson.properties.jml_umkm_kbli_l": jml_umkm_kbli_l,
                "geojson.properties.jml_umkm_kbli_m": jml_umkm_kbli_m,
                "geojson.properties.jml_umkm_kbli_n": jml_umkm_kbli_n,
                "geojson.properties.jml_umkm_kbli_o": jml_umkm_kbli_o,
                "geojson.properties.jml_umkm_kbli_p": jml_umkm_kbli_p,
                "geojson.properties.jml_umkm_kbli_q": jml_umkm_kbli_q,
                "geojson.properties.jml_umkm_kbli_r": jml_umkm_kbli_r,
                "geojson.properties.jml_umkm_kbli_s": jml_umkm_kbli_s,
                "geojson.properties.jml_umkm_kbli_t": jml_umkm_kbli_t,
                "geojson.properties.jml_umkm_kbli_u": jml_umkm_kbli_u,
            },
        },
        { new: true }
    );

    if (!updatedRt) {
        console.error(`Failed to update Rt data for RT ${kodeRt}`);
        return;
    }

    console.log(`Successfully updated data for RT ${kodeRt}`);
};