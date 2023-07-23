require("dotenv").config();
const { Penumpang, User } = require("../../models");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");
const { where } = require("sequelize");

async function processData(uuid) {
  try {
    const response = await axios.get(API_PEDATREN_URL + "/person/" + uuid, {
      headers: {
        "x-api-key": API_PEDATREN_TOKEN,
      },
    });

    await Penumpang.create({
      santri_uuid: response.data.uuid,
      santri_nama: response.data.nama_lengkap,
      santri_niup: response.data.warga_pesantren.niup,
      santri_wilayah:
        response.data.domisili_santri[response.data.domisili_santri.length - 1]
          .wilayah,
      santri_blok:
        response.data.domisili_santri[response.data.domisili_santri.length - 1]
          .blok,
      blok_id:
        response.data.domisili_santri[response.data.domisili_santri.length - 1]
          .id_blok,
      raw: JSON.stringify(response.data),
    });
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

module.exports = {
  setupPenumpang: async (req, res) => {
    try {
      const data = await axios.get(API_PEDATREN_URL + "/santri", {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
        params: {
          limit: 1000,
        },
      });
      responseHelper.allDataSetup(res, data.headers["x-pagination-total-page"]);
    } catch (err) {
      responseHelper.serverError(
        res,
        "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  generatePenumpang: async (req, res) => {
    try {
      const data = await axios.get(API_PEDATREN_URL + "/santri", {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
        params: {
          limit: 1,
          page: req.params.page,
        },
      });

      await Promise.all(data.data.map((d) => processData(d.uuid)));

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
};
