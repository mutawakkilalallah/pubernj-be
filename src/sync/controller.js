require("dotenv").config();
const { Op } = require("sequelize");
const {
  Penumpang,
  User,
  Santri,
  Dropspot,
  sequelize,
} = require("../../models");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");

async function processDataSantri(uuid) {
  try {
    const response = await axios.get(API_PEDATREN_URL + "/person/" + uuid, {
      headers: {
        "x-api-key": API_PEDATREN_TOKEN,
      },
    });

    await Santri.create({
      uuid: response.data.uuid,
      niup: response.data.warga_pesantren.niup
        ? response.data.warga_pesantren.niup
        : null,
      nama_lengkap: response.data.nama_lengkap,
      jenis_kelamin: response.data.jenis_kelamin,
      negara: response.data.negara ? response.data.negara : null,
      provinsi: response.data.provinsi ? response.data.provinsi : null,
      kabupaten: response.data.kabupaten ? response.data.kabupaten : null,
      kecamatan: response.data.kecamatan ? response.data.kecamatan : null,
      wilayah: response.data.domisili_santri
        ? response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].wilayah
        : null,
      alias_wilayah: response.data.domisili_santri
        ? response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].wilayah
            .toLowerCase()
            .replace(/ /g, "-")
        : null,
      blok: response.data.domisili_santri
        ? response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].blok
        : null,
      id_blok: response.data.domisili_santri
        ? response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].id_blok
        : null,
      raw: JSON.stringify(response.data),
    });
    return true;
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processDataPenumpangKec(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      attributes: ["santri_uuid"],
      where: {
        santri_uuid: uuid,
      },
    });
    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        attributes: ["uuid", "kecamatan"],
        where: {
          uuid: uuid,
        },
      });
      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%" + data.kecamatan + "%",
          },
        },
      });
      if (dropspot.length >= 1) {
        await Penumpang.create({
          santri_uuid: data.uuid,
          dropspot_id: dropspot[0].id,
        });

        await Santri.update(
          {
            status_kepulangan: "rombongan",
          },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return true;
      } else {
        console.log(
          uuid +
            " : " +
            `dropspot tidak di temukan berdasarkan ${data.kecamatan}`
        );
        return false;
      }
    }
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processDataPenumpangKab(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      attributes: ["santri_uuid"],
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        attributes: ["uuid", "kabupaten"],
        where: {
          uuid: uuid,
        },
      });

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%" + data.kabupaten + "%",
          },
        },
      });

      if (dropspot.length >= 1) {
        await Penumpang.create({
          santri_uuid: data.uuid,
          dropspot_id: dropspot[0].id,
        });

        await Santri.update(
          {
            status_kepulangan: "rombongan",
          },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return true;
      } else {
        console.log(
          uuid +
            " : " +
            `dropspot tidak di temukan berdasarkan ${data.kabupaten}`
        );
        return false;
      }
    }
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processDataPenumpangProv(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      attributes: ["santri_uuid"],
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        attributes: ["uuid", "provinsi"],
        where: {
          uuid: uuid,
        },
      });

      let whereCondition = {};

      if (data.provinsi === "Kepulauan Riau") {
        whereCondition = {
          cakupan: "Kepulauan Riau",
        };
      } else if (data.provinsi === "Riau") {
        whereCondition = {
          cakupan: "Riau",
        };
      } else {
        whereCondition = {
          cakupan: {
            [Op.like]: "%" + data.provinsi + "%",
          },
        };
      }

      const dropspot = await Dropspot.findAll({
        where: whereCondition,
      });

      if (dropspot.length >= 1) {
        await Penumpang.create({
          santri_uuid: data.uuid,
          dropspot_id: dropspot[0].id,
        });

        await Santri.update(
          {
            status_kepulangan: "rombongan",
          },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return true;
      } else {
        console.log(
          uuid +
            " : " +
            `dropspot tidak di temukan berdasarkan ${data.provinsi}`
        );
        return false;
      }
    }
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processDataPenumpangNeg(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      attributes: ["santri_uuid"],
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        attributes: ["uuid", "negara"],
        where: {
          uuid: uuid,
        },
      });

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%" + data.negara + "%",
          },
        },
      });

      if (dropspot.length >= 1) {
        await Penumpang.create({
          santri_uuid: data.uuid,
          dropspot_id: dropspot[0].id,
        });

        await Santri.update(
          {
            status_kepulangan: "rombongan",
          },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return true;
      } else {
        console.log(
          uuid + " : " + `dropspot tidak di temukan berdasarkan ${data.negara}`
        );
        return false;
      }
    }
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processDataPenumpangPaiton(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      attributes: ["santri_uuid"],
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        attributes: ["uuid"],
        where: {
          uuid: uuid,
        },
      });

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%Pondokkelor%",
          },
        },
      });

      if (dropspot.length >= 1) {
        await Penumpang.create({
          santri_uuid: data.uuid,
          dropspot_id: dropspot[0].id,
        });

        await Santri.update(
          {
            status_kepulangan: "rombongan",
          },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return true;
      } else {
        console.log(
          uuid + " : " + `dropspot tidak di temukan berdasarkan Pondokkelor`
        );
        return false;
      }
    }
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processExclude(uuid) {
  try {
    await Penumpang.destroy({
      where: {
        santri_uuid: uuid,
      },
    });
    await Santri.update(
      {
        status_kepulangan: "non-rombongan",
      },
      {
        where: {
          uuid: uuid,
        },
      }
    );
    return true;
  } catch (err) {
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processUpdateDataSantri(uuid) {
  // let transaction;
  try {
    // transaction = await sequelize.transaction();
    await Penumpang.destroy(
      {
        where: {
          santri_uuid: uuid,
        },
      }
      // { transaction }
    );
    await Santri.destroy(
      {
        where: {
          uuid: uuid,
        },
      }
      // { transaction }
    );
    // await transaction.commit();
    return true;
  } catch (err) {
    // if (transaction) {
    // await transaction.rollback();
    // }
    console.log(uuid + " : " + err.message);
    return false;
  }
}

async function processUpdateDataPenumpang(id, uuid) {
  try {
    const response = await axios.get(API_PEDATREN_URL + "/person/" + uuid, {
      headers: {
        "x-api-key": API_PEDATREN_TOKEN,
      },
    });

    await Penumpang.update(
      {
        santri_nama: response.data.nama_lengkap,
        santri_niup: response.data.warga_pesantren.niup,
        santri_wilayah:
          response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].wilayah,
        santri_blok:
          response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].blok,
        blok_id:
          response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].id_blok,
        raw: JSON.stringify(response.data),
      },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (err) {
    console.log(err.message);
  }
}

async function processUpdateDataUser(id, role, uuid) {
  try {
    const response = await axios.get(API_PEDATREN_URL + "/person/" + uuid, {
      headers: {
        "x-api-key": API_PEDATREN_TOKEN,
      },
    });
    console.log(response.data.uuid);
    await User.update(
      {
        santri_nama: response.data.nama_lengkap,
        blok_id:
          role != "wilayah"
            ? null
            : response.data.domisili_santri[
                response.data.domisili_santri.length - 1
              ].id_blok,
        raw: JSON.stringify(response.data),
      },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (err) {
    console.log(err.message);
  }
}

function getDataBaru(dataApi, dataDb) {
  return dataApi
    .filter((itemApi) => !dataDb.some((itemDb) => itemDb.uuid === itemApi.uuid))
    .map((item) => item.uuid);
}

function getDataExpired(dataApi, dataDb) {
  return dataDb
    .filter(
      (itemDb) => !dataApi.some((itemApi) => itemApi.uuid === itemDb.uuid)
    )
    .map((item) => item.uuid);
}

// function getDataExpiredPenumpang(dataSantri, dataPenumpang) {
//   return dataPenumpang
//     .filter(
//       (itemPn) =>
//         !dataSantri.some((itemSn) => itemSn.uuid === itemPn.santri_uuid)
//     )
//     .map((item) => item.santri_uuid);
// }

module.exports = {
  generateSantri: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;

      const data = await axios.get(API_PEDATREN_URL + "/santri", {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
        params: {
          disable_pagination: true,
        },
      });

      const results = await Promise.all(
        data.data.map((d) => processDataSantri(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  generatePenumpangv1: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listKabupaten = [
        "Kab. Pasuruan",
        "Kota Pasuruan",
        "Kab. Jember",
        "kab. Banyuwangi",
        "Kab. Lumajang",
        "Kab. Bondowoso",
      ];
      const data = await Santri.findAll({
        attributes: ["uuid", "kabupaten"],
        limit: 10000,
        where: {
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKec(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv2: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listKabupaten = [
        "Kab. Bangkalan",
        "Kab. Pamekasan",
        "kab. Sampang",
        "Kota Surabaya",
        "Kab. Sidoarjo",
        "Kab. Ngawi",
        "Kota Madiun",
        "Kab. Nganjuk",
        "Kab. Kediri",
        "Kota Kediri",
        "Kab. Jombang",
        "Kab. Mojokerto",
        "Kab. Tulungagung",
        "Kab. Lamongan",
        "Kab. Tuban",
        "Kab. Gresik",
        "Kab. Magetan",
        "Kab. Bojonegoro",
        "Kab. Malang",
        "Kota Malang",
        "Kota Batu",
        "Kab. Blitar",
        "Kab. Ponorogo",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKab(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv3: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listKabupaten = [
        "Kab. Probolinggo",
        "Kab. Situbondo",
        "Kab. Sumenep",
        "Kab. Gresik",
      ];
      const listKecamatan = [
        "Paiton",
        "Besuki",
        "Jatibanteng",
        "Suboh",
        "Sumbermalang",
        "Mlandingan",
        "Bungatan",
        "Arjasa",
        "Kangayan",
        "Sapeken",
        "Raas",
        "Nonggunong",
        "Gayam",
        "Sangkapura",
        "Tambak",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          kecamatan: {
            [Op.in]: listKecamatan,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKec(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv4: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listKabupaten = [
        "Kota Probolinggo",
        "Kab. Probolinggo",
        "Kab. Situbondo",
      ];
      const listKecamatan = [
        "Paiton",
        "Besuki",
        "Jatibanteng",
        "Suboh",
        "Sumbermalang",
        "Mlandingan",
        "Bungatan",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          kecamatan: {
            [Op.notIn]: listKecamatan,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });
      const results = await Promise.all(
        data.map((d) => processDataPenumpangKec(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv5: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listProvinsi = ["Bali"];
      const listKabupaten = [
        "Kab. Buleleng",
        "Kab. Jembrana",
        "Kab. Tabanan",
        "Kab. Badung",
        "Kab. Tuban",
        "Kab. Gianyar",
        "Kota Denpasar",
        "Kab. Karangasem",
        "Kab. Bangli",
        "Kab. Klungkung",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          provinsi: {
            [Op.in]: listProvinsi,
          },
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKab(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv6: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listProvinsi = ["Jawa Tengah", "Daerah Istimewa Yogyakarta"];
      const listKabupaten = [
        "Kab. Bantul",
        "Kab. Wonogiri",
        "Kab. Grobogan",
        "Kab. Kudus",
        "Kab. Sleman",
        "Kab. Demak",
        "Kota Semarang",
        "Kab. Semarang",
        "Kab. Blora",
        "Kab. Karanganyar",
        "Kab. Kebumen",
        "Kab. Klaten",
        "Kab. Banyumas",
        "Kab. Pekalongan",
        "Kab. Purworejo",
        "Kab. Sragen",
        "Kab. Tegal",
        "Kab. Temanggung",
        "Kota Yogyakarta",
        "Kab. Jepara",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          provinsi: {
            [Op.in]: listProvinsi,
          },
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKab(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv7: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listProvinsi = ["Banten"];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          provinsi: {
            [Op.in]: listProvinsi,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangProv(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv8: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listProvinsi = ["Jawa Barat", "DKI Jakarta"];
      const listKabupaten = [
        "Kota Adm. Jakarta Pusat",
        "Kota Adm. Jakarta Utara",
        "Kota Adm. Jakarta Barat",
        "Kota Adm. Jakarta Selatan",
        "Kota Adm. Jakarta Timur",
        "Kab. Bekasi",
        "Kota Bekasi",
        "Kota Depok",
        "Kab. Bandung Barat",
        "Kab. Bogor",
        "Kota Bogor",
        "Kab. Garut",
        "Kab. Sukabumi",
        "Kab. Karawang",
        "Kab. Cirebon",
        "Kota Cirebon",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          provinsi: {
            [Op.in]: listProvinsi,
          },
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKab(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv9: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listProvinsi = [
        "Nusa Tenggara Barat",
        "Nusa Tenggara Timur",
        "Kepulauan Riau",
        "Kalimantan Barat",
        "Kalimantan Timur",
        "Kalimantan Selatan",
        "Kalimantan Utara",
        "Kalimantan Tengah",
        "Papua",
        "Papua Barat",
        "Kepulauan Bangka Belitung",
        "Lampung",
        "Maluku",
        "Maluku Utara",
        "Bengkulu",
        "Jambi",
        "Riau",
        "Sulawesi Barat",
        "Sulawesi Selatan",
        "Sulawesi Tengah",
        "Sulawesi Tenggara",
        "Sulawesi Utara",
        "Gorontalo",
        "Sumatera Barat",
        "Sumatera Selatan",
        "Sumatera Utara",
        "Aceh",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          provinsi: {
            [Op.in]: listProvinsi,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangProv(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv10: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listNegara = ["Malaysia", "Thailand"];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          negara: {
            [Op.in]: listNegara,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });
      const results = await Promise.all(
        data.map((d) => processDataPenumpangNeg(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv11: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kecamatan: {
            [Op.in]: ["Paiton"],
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangPaiton(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv12: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;
      const listKabupaten = ["Kab. Sumenep", "Kab. Gresik"];
      const listKecamatan = [
        "Arjasa",
        "Kangayan",
        "Sapeken",
        "Raas",
        "Nonggunong",
        "Gayam",
        "Sangkapura",
        "Tambak",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kabupaten: {
            [Op.in]: listKabupaten,
          },
          kecamatan: {
            [Op.notIn]: listKecamatan,
          },
          uuid: {
            [Op.notIn]: sequelize.literal(
              "(SELECT santri_uuid FROM penumpang)"
            ),
          },
        },
        include: {
          model: Penumpang,
          as: "penumpang",
        },
      });

      const results = await Promise.all(
        data.map((d) => processDataPenumpangKab(d.uuid))
      );

      const berhasil = results.filter((result) => result).length;
      const gagal = results.filter((result) => !result).length;

      totalBerhasil += berhasil;
      totalGagal += gagal;

      console.log(
        `didapat : ${data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
      );

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  excludePenumpang: async (req, res) => {
    try {
      let totalBerhasil = 0;
      let totalGagal = 0;

      for (let index = 1; index < 3; index++) {
        const data = await axios.get(API_PEDATREN_URL + "/santri", {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
          params: {
            limit: 1000,
            status: "santri-non-siswa",
            jenis_kelamin: "L",
            page: index,
          },
        });
        console.log(data.data.length);
        const results = await Promise.all(
          data.data.map((d) => processExclude(d.uuid))
        );

        const berhasil = results.filter((result) => result).length;
        const gagal = results.filter((result) => !result).length;

        totalBerhasil += berhasil;
        totalGagal += gagal;

        console.log(
          `didapat : ${data.data.length} - diproses : ${results.length} | berhasil(${berhasil})/gagal(${gagal})`
        );
      }

      console.log(
        `Total berhasil: ${totalBerhasil}, Total gagal: ${totalGagal}`
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateSantri: async (req, res) => {
    let totalBerhasilTambah = 0;
    let totalGagalTambah = 0;
    let totalBerhasilDestroy = 0;
    let totalGagalDestroy = 0;
    try {
      const dataDbPuber = await Santri.findAll({
        attributes: ["uuid"],
      });

      const dataApiPedateren = await axios.get(API_PEDATREN_URL + "/santri", {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
        params: {
          disable_pagination: true,
        },
      });

      const dataBaru = getDataBaru(dataApiPedateren.data, dataDbPuber);
      const dataExpired = getDataExpired(dataApiPedateren.data, dataDbPuber);

      const resultTambah = await Promise.all(
        dataBaru.map((d) => processDataSantri(d))
      );
      const resultDestroy = await Promise.all(
        dataExpired.map((d) => processUpdateDataSantri(d))
      );

      const berhasilTambah = resultTambah.filter((resultT) => resultT).length;
      const gagalTambah = resultTambah.filter((resultT) => !resultT).length;
      const berhasilDestroy = resultDestroy.filter((resultD) => resultD).length;
      const gagalDestory = resultDestroy.filter((resultD) => !resultD).length;

      totalBerhasilTambah += berhasilTambah;
      totalGagalTambah += gagalTambah;
      totalBerhasilDestroy += berhasilDestroy;
      totalGagalDestroy += gagalDestory;

      console.log(
        `didapat data baru : ${dataBaru.length} - diproses data baru  : ${resultTambah.length} | berhasil(${berhasilTambah})/gagal(${gagalTambah})`
      );

      console.log(
        `Total berhasil data baru : ${totalBerhasilTambah}, Total gagal data baru : ${totalGagalTambah}`
      );

      console.log(
        `didapat data expired : ${dataExpired.length} - diproses data expired : ${resultDestroy.length} | berhasil(${berhasilDestroy})/gagal(${gagalDestory})`
      );

      console.log(
        `Total berhasil data expired: ${totalBerhasilDestroy}, Total gagal: ${totalGagalDestroy}`
      );
      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  // updatePenumpang: async (req, res) => {
  //   // let totalBerhasilTambah = 0;
  //   // let totalGagalTambah = 0;
  //   // let totalBerhasilDestroy = 0;
  //   // let totalGagalDestroy = 0;
  //   try {
  //     const dataPenumpang = await Penumpang.findAll({
  //       attributes: ["santri_uuid"],
  //     });
  //     const dataSantri = await Santri.findAll({
  //       attributes: ["uuid"],
  //     });

  //     const dataExpired = getDataExpiredPenumpang(dataSantri, dataPenumpang);
  //     res.json(dataExpired);
  //     // const resultDestroy = await Promise.all(
  //     //   dataExpired.map((d) => processUpdateDataSantri(d))
  //     // );

  //     // const berhasilTambah = resultTambah.filter((resultT) => resultT).length;
  //     // const gagalTambah = resultTambah.filter((resultT) => !resultT).length;
  //     // const berhasilDestroy = resultDestroy.filter((resultD) => resultD).length;
  //     // const gagalDestory = resultDestroy.filter((resultD) => !resultD).length;

  //     // totalBerhasilTambah += berhasilTambah;
  //     // totalGagalTambah += gagalTambah;
  //     // totalBerhasilDestroy += berhasilDestroy;
  //     // totalGagalDestroy += gagalDestory;

  //     // console.log(
  //     //   `didapat data baru : ${dataBaru.length} - diproses data baru  : ${resultTambah.length} | berhasil(${berhasilTambah})/gagal(${gagalTambah})`
  //     // );

  //     // console.log(
  //     //   `Total berhasil data baru : ${totalBerhasilTambah}, Total gagal data baru : ${totalGagalTambah}`
  //     // );

  //     // console.log(
  //     //   `didapat data expired : ${dataExpired.length} - diproses data expired : ${resultDestroy.length} | berhasil(${berhasilDestroy})/gagal(${gagalDestory})`
  //     // );

  //     // console.log(
  //     //   `Total berhasil data expired: ${totalBerhasilDestroy}, Total gagal: ${totalGagalDestroy}`
  //     // );
  //     // responseHelper.syncSuccess(req, res);
  //   } catch (err) {
  //     responseHelper.serverError(req,
  //       res,
  //       err.message
  //       // "Terjadi kesalahan saat koneksi ke PEDATREN"
  //     );
  //   }
  // },

  updateUser: async (req, res) => {
    try {
      const data = await User.findAll();

      await Promise.all(
        data.map((d) => processUpdateDataUser(d.id, d.role, d.santri_uuid))
      );

      responseHelper.syncSuccess(req, res);
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },
};
