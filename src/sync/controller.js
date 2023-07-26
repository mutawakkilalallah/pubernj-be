require("dotenv").config();
const { Op } = require("sequelize");
const { Penumpang, User, Santri, Dropspot, Area } = require("../../models");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");

async function processDataPenumpangKec(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        where: {
          uuid: uuid,
        },
      });

      data.raw = JSON.parse(data.raw);

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%" + data.raw.kecamatan + "%",
          },
        },
      });

      await Penumpang.create({
        santri_uuid: data.uuid,
        santri_nama: data.nama_lengkap,
        santri_niup: data.niup,
        dropspot_id: dropspot.length < 1 ? null : dropspot[0].id,
        santri_wilayah: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .wilayah
          : null,
        santri_blok: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1].blok
          : null,
        blok_id: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .id_blok
          : null,
        raw: JSON.stringify(data.raw),
      });

      await Santri.update(
        {
          status_kepulangan: "pulang-rombongan",
        },
        {
          where: {
            uuid: uuid,
          },
        }
      );
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function processDataPenumpangKab(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        where: {
          uuid: uuid,
        },
      });

      data.raw = JSON.parse(data.raw);

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%" + data.raw.kabupaten + "%",
          },
        },
      });

      await Penumpang.create({
        santri_uuid: data.uuid,
        santri_nama: data.nama_lengkap,
        santri_niup: data.niup,
        dropspot_id: dropspot.length < 1 ? null : dropspot[0].id,
        santri_wilayah: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .wilayah
          : null,
        santri_blok: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1].blok
          : null,
        blok_id: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .id_blok
          : null,
        raw: JSON.stringify(data.raw),
      });

      await Santri.update(
        {
          status_kepulangan: "pulang-rombongan",
        },
        {
          where: {
            uuid: uuid,
          },
        }
      );
    }
  } catch (err) {
    console.log(uuid);
    console.log(err.message);
  }
}

async function processDataPenumpangProv(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        where: {
          uuid: uuid,
        },
      });

      data.raw = JSON.parse(data.raw);

      let whereCondition = {};

      if (data.raw.provinsi === "Kepulauan Riau") {
        whereCondition = {
          cakupan: "Kepulauan Riau",
        };
      } else if (data.raw.provinsi === "Riau") {
        whereCondition = {
          cakupan: "Riau",
        };
      } else {
        whereCondition = {
          cakupan: {
            [Op.like]: "%" + data.raw.provinsi + "%",
          },
        };
      }

      const dropspot = await Dropspot.findAll({
        where: whereCondition,
      });

      await Penumpang.create({
        santri_uuid: data.uuid,
        santri_nama: data.nama_lengkap,
        santri_niup: data.niup,
        dropspot_id: dropspot.length < 1 ? null : dropspot[0].id,
        santri_wilayah: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .wilayah
          : null,
        santri_blok: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1].blok
          : null,
        blok_id: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .id_blok
          : null,
        raw: JSON.stringify(data.raw),
      });

      await Santri.update(
        {
          status_kepulangan: "pulang-rombongan",
        },
        {
          where: {
            uuid: uuid,
          },
        }
      );
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function processDataPenumpangNeg(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        where: {
          uuid: uuid,
        },
      });

      data.raw = JSON.parse(data.raw);

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%" + data.raw.negara + "%",
          },
        },
      });

      await Penumpang.create({
        santri_uuid: data.uuid,
        santri_nama: data.nama_lengkap,
        santri_niup: data.niup,
        dropspot_id: dropspot.length < 1 ? null : dropspot[0].id,
        santri_wilayah: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .wilayah
          : null,
        santri_blok: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1].blok
          : null,
        blok_id: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .id_blok
          : null,
        raw: JSON.stringify(data.raw),
      });

      await Santri.update(
        {
          status_kepulangan: "pulang-rombongan",
        },
        {
          where: {
            uuid: uuid,
          },
        }
      );
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function processDataPenumpangPaiton(uuid) {
  try {
    const penumpang = await Penumpang.findOne({
      where: {
        santri_uuid: uuid,
      },
    });

    if (penumpang) {
      //
    } else {
      const data = await Santri.findOne({
        where: {
          uuid: uuid,
        },
      });

      data.raw = JSON.parse(data.raw);

      const dropspot = await Dropspot.findAll({
        where: {
          cakupan: {
            [Op.like]: "%Pondokkelor%",
          },
        },
      });

      await Penumpang.create({
        santri_uuid: data.uuid,
        santri_nama: data.nama_lengkap,
        santri_niup: data.niup,
        dropspot_id: dropspot.length < 1 ? null : dropspot[0].id,
        santri_wilayah: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .wilayah
          : null,
        santri_blok: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1].blok
          : null,
        blok_id: data.raw.domisili_santri
          ? data.raw.domisili_santri[data.raw.domisili_santri.length - 1]
              .id_blok
          : null,
        raw: JSON.stringify(data.raw),
      });

      await Santri.update(
        {
          status_kepulangan: "pulang-rombongan",
        },
        {
          where: {
            uuid: uuid,
          },
        }
      );
    }
  } catch (err) {
    console.log(err.message);
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

async function processDataSantri(uuid) {
  try {
    const response = await axios.get(API_PEDATREN_URL + "/person/" + uuid, {
      headers: {
        "x-api-key": API_PEDATREN_TOKEN,
      },
    });

    await Santri.create({
      uuid: response.data.uuid,
      nama_lengkap: response.data.nama_lengkap,
      niup:
        response.data.warga_pesantren.niup != null
          ? response.data.warga_pesantren.niup
          : null,
      negara: response.data.negara ? response.data.negara : null,
      provinsi: response.data.provinsi ? response.data.provinsi : null,
      kabupaten: response.data.kabupaten ? response.data.kabupaten : null,
      kecamatan: response.data.kecamatan ? response.data.kecamatan : null,
      wilayah_id: response.data.domisili_santri
        ? response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].id_wilayah
        : null,
      blok_id: response.data.domisili_santri
        ? response.data.domisili_santri[
            response.data.domisili_santri.length - 1
          ].id_blok
        : null,
      raw: JSON.stringify(response.data),
    });
  } catch (err) {
    console.log(uuid + " : " + err.message);
  }
}

async function processUpdateDataSantri(uuid) {
  try {
    const response = await axios.get(API_PEDATREN_URL + "/person/" + uuid, {
      headers: {
        "x-api-key": API_PEDATREN_TOKEN,
      },
    });

    await Santri.update(
      {
        nama_lengkap: response.data.nama_lengkap,
        niup:
          response.data.warga_pesantren.niup != null
            ? response.data.warga_pesantren.niup
            : null,
        negara: response.data.negara ? response.data.negara : null,
        provinsi: response.data.provinsi ? response.data.provinsi : null,
        kabupaten: response.data.kabupaten ? response.data.kabupaten : null,
        kecamatan: response.data.kecamatan ? response.data.kecamatan : null,
        wilayah_id: response.data.domisili_santri
          ? response.data.domisili_santri[
              response.data.domisili_santri.length - 1
            ].id_wilayah
          : null,
        blok_id: response.data.domisili_santri
          ? response.data.domisili_santri[
              response.data.domisili_santri.length - 1
            ].id_blok
          : null,
        raw: JSON.stringify(response.data),
      },
      {
        where: {
          uuid: uuid,
        },
      }
    );
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  generatePenumpangv1: async (req, res) => {
    try {
      const listKabupaten = [
        "Kab. Pasuruan",
        "Kota Pasuruan",
        "Kab. Jember",
        "kab. Banyuwangi",
        "Kab. Lumajang",
        "Kab. Bondowoso",
      ];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kabupaten: {
            [Op.in]: listKabupaten,
          },
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangKec(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv2: async (req, res) => {
    try {
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
        },
      });

      // console.log(data.length);
      await Promise.all(data.map((d) => processDataPenumpangKab(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv3: async (req, res) => {
    try {
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
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangKec(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv4: async (req, res) => {
    try {
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
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangKec(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv5: async (req, res) => {
    try {
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
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangKab(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv6: async (req, res) => {
    try {
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
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangKab(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv7: async (req, res) => {
    try {
      const listProvinsi = ["Banten"];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          provinsi: {
            [Op.in]: listProvinsi,
          },
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangProv(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv8: async (req, res) => {
    try {
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
        },
      });

      console.log(data.length);
      await Promise.all(data.map((d) => processDataPenumpangKab(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv9: async (req, res) => {
    try {
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
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangProv(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv10: async (req, res) => {
    try {
      const listNegara = ["Malaysia", "Thailand"];
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          negara: {
            [Op.in]: listNegara,
          },
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangNeg(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv11: async (req, res) => {
    try {
      const data = await Santri.findAll({
        limit: 10000,
        where: {
          kecamatan: {
            [Op.in]: ["Paiton"],
          },
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangPaiton(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpangv12: async (req, res) => {
    try {
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
        },
      });

      await Promise.all(data.map((d) => processDataPenumpangKab(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  updatePenumpang: async (req, res) => {
    try {
      const data = await Penumpang.findAll();

      await Promise.all(
        data.map((d) => processUpdateDataPenumpang(d.id, d.santri_uuid))
      );

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  updateUser: async (req, res) => {
    try {
      const data = await User.findAll();

      await Promise.all(
        data.map((d) => processUpdateDataUser(d.id, d.role, d.santri_uuid))
      );

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generateSantri: async (req, res) => {
    try {
      for (let index = 1; index < 9; index++) {
        const data = await axios.get(API_PEDATREN_URL + "/santri", {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
          params: {
            limit: 1000,
            page: index,
          },
        });
        await Promise.all(data.data.map((d) => processDataSantri(d.uuid)));
      }
      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  updateSantri: async (req, res) => {
    try {
      const data = await Santri.findAll({
        where: {
          kecamatan: null,
        },
      });
      console.log(data.length);
      // await Promise.all(data.map((d) => processUpdateDataSantri(d.uuid)));

      responseHelper.syncSuccess(res);
    } catch (err) {
      responseHelper.serverError(
        res,
        err.message
        // "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },
};
