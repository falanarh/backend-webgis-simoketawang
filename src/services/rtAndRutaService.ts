import mongoose from "mongoose";
import Rt from "../models/rtModel"; // Path to your Rt model
import RumahTangga from "../models/rumahTanggaModel"; // Path to your RumahTangga model

export const updateRtAggregates = async () => {
    try {
        // Step 1: Get all RumahTangga documents
        const rumahTanggaData = await RumahTangga.aggregate([
            {
                $group: {
                    _id: "$kodeRt",
                    totalUmkm: { $sum: 1 },
                    umkmTetap: {
                        $sum: {
                            $cond: [{ $eq: ["$jenisUmkm", "tetap"] }, 1, 0]
                        }
                    },
                    umkmNontetap: {
                        $sum: {
                            $cond: [{ $eq: ["$jenisUmkm", "nontetap"] }, 1, 0]
                        }
                    },
                    kbliCounts: {
                        $push: "$klasifikasiKbli"
                    },
                    totalPendapatan: { $sum: "$pendapatanSebulanTerakhir" }
                }
            },
            {
                $addFields: {
                    kbliAggregates: {
                        a: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_a"] }
                                }
                            }
                        },
                        b: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_b"] }
                                }
                            }
                        },
                        c: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_c"] }
                                }
                            }
                        },
                        d: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_d"] }
                                }
                            }
                        },
                        e: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_e"] }
                                }
                            }
                        },
                        f: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_f"] }
                                }
                            }
                        },
                        g: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_g"] }
                                }
                            }
                        },
                        h: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_h"] }
                                }
                            }
                        },
                        i: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_i"] }
                                }
                            }
                        },
                        j: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_j"] }
                                }
                            }
                        },
                        k: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_k"] }
                                }
                            }
                        },
                        l: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_l"] }
                                }
                            }
                        },
                        m: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_m"] }
                                }
                            }
                        },
                        n: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_n"] }
                                }
                            }
                        },
                        o: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_o"] }
                                }
                            }
                        },
                        p: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_p"] }
                                }
                            }
                        },
                        q: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_q"] }
                                }
                            }
                        },
                        r: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_r"] }
                                }
                            }
                        },
                        s: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_s"] }
                                }
                            }
                        },
                        t: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_t"] }
                                }
                            }
                        },
                        u: {
                            $size: {
                                $filter: {
                                    input: "$kbliCounts",
                                    cond: { $eq: ["$$this", "kbli_u"] }
                                }
                            }
                        }
                    },
                    rata2Pendapatan: {
                        $cond: [
                            { $gt: ["$totalUmkm", 0] },
                            { $divide: ["$totalPendapatan", "$totalUmkm"] },
                            0
                        ]
                    }
                }
            }
        ]);

        // Extract RT codes that have data
        const rtCodesWithData = new Set(rumahTanggaData.map(rtData => rtData._id));

        // Step 2: Update RT documents with aggregated data
        for (const rtData of rumahTanggaData) {
            console.log(rtData);
            await Rt.findOneAndUpdate(
                { kode: rtData._id },
                {
                    $set: {
                        "geojson.features.$[elem].properties.jml_umkm": rtData.totalUmkm,
                        "geojson.features.$[elem].properties.jml_umkm_tetap": rtData.umkmTetap,
                        "geojson.features.$[elem].properties.jml_umkm_nontetap": rtData.umkmNontetap,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_a": rtData.kbliAggregates.a,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_b": rtData.kbliAggregates.b,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_c": rtData.kbliAggregates.c,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_d": rtData.kbliAggregates.d,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_e": rtData.kbliAggregates.e,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_f": rtData.kbliAggregates.f,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_g": rtData.kbliAggregates.g,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_h": rtData.kbliAggregates.h,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_i": rtData.kbliAggregates.i,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_j": rtData.kbliAggregates.j,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_k": rtData.kbliAggregates.k,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_l": rtData.kbliAggregates.l,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_m": rtData.kbliAggregates.m,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_n": rtData.kbliAggregates.n,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_o": rtData.kbliAggregates.o,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_p": rtData.kbliAggregates.p,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_q": rtData.kbliAggregates.q,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_r": rtData.kbliAggregates.r,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_s": rtData.kbliAggregates.s,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_t": rtData.kbliAggregates.t,
                        "geojson.features.$[elem].properties.jml_umkm_kbli_u": rtData.kbliAggregates.u,
                        "geojson.features.$[elem].properties.total_pendapatan_sebulan_terakhir": rtData.totalPendapatan,
                        "geojson.features.$[elem].properties.rata2_pendapatan_sebulan_terakhir": rtData.rata2Pendapatan
                    }
                },
                { arrayFilters: [{ "elem.properties.kode": rtData._id }], new: true }
            );
        }

        // Step 3: Set aggregates to zero for RTs without RumahTangga data
        const allRts = await Rt.find({}); // Get all RTs
        for (const rt of allRts) {
            if (!rtCodesWithData.has(rt.kode)) {
                await Rt.findOneAndUpdate(
                    { kode: rt.kode },
                    {
                        $set: {
                            "geojson.features.$[elem].properties.jml_umkm": 0,
                            "geojson.features.$[elem].properties.jml_umkm_tetap": 0,
                            "geojson.features.$[elem].properties.jml_umkm_nontetap": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_a": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_b": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_c": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_d": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_e": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_f": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_g": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_h": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_i": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_j": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_k": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_l": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_m": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_n": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_o": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_p": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_q": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_r": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_s": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_t": 0,
                            "geojson.features.$[elem].properties.jml_umkm_kbli_u": 0,
                            "geojson.features.$[elem].properties.total_pendapatan_sebulan_terakhir": 0,
                            "geojson.features.$[elem].properties.rata2_pendapatan_sebulan_terakhir": 0
                        }
                    },
                    { arrayFilters: [{ "elem.properties.kode": rt.kode }], new: true }
                );
            }
        }

        console.log("Aggregates updated successfully.");
    } catch (error) {
        console.error("Error updating aggregates:", error);
    }
};
