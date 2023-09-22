const { Op } = require("sequelize");
const {
  Penumpang,
  Santri,
  Persyaratan,
  User,
  Dropspot,
  Area,
  LogPedatren,
} = require("../../models");
const responseHelper = require("../../helpers/response-helper");
const validation = require("../../validations/surat-jalan-validation");
const axios = require("axios");
const { API_PEDATREN_URL } = process.env;
const logger = require("../../helpers/logger");
const jwt_decode = require("jwt-decode");
const fs = require("fs");
const moment = require("moment-timezone");

async function prosesIzin(niup, userUuid, token) {
  try {
    const santri = await Santri.findOne({
      where: {
        niup: niup,
      },
    });
    if (!santri) {
      await LogPedatren.create({
        user_uuid: userUuid,
        message: "Tidak ditemukan data di PEDATREN",
      });
      return false;
    } else {
      const penumpang = await Penumpang.findOne({
        where: {
          santri_uuid: santri.uuid,
        },
        include: {
          model: Dropspot,
          as: "dropspot",
        },
      });
      let timestamp;
      if (santri.jenis_kelamin == "L") {
        timestamp = moment.tz(
          penumpang.dropspot.jam_berangkat_pa,
          "Asia/Jakarta"
        );
      } else if (santri.jenis_kelamin == "P") {
        timestamp = moment.tz(
          penumpang.dropspot.jam_berangkat_pi,
          "Asia/Jakarta"
        );
      }
      const sejak_tanggal = timestamp.format("YYYY-MM-DD HH:mm:ss");
      santri.raw = JSON.parse(santri?.raw);
      const dataSantri = santri?.raw?.santri.filter(
        (item) => item.tanggal_akhir === null
      );
      let form = {};
      if (santri.jenis_kelamin == "L") {
        form = {
          bermalam: "Y",
          id_alasan_izin: 19,
          id_kabupaten_tujuan: santri?.raw?.id_kabupaten,
          id_kecamatan_tujuan: santri?.raw?.id_kecamatan,
          nis_santri: dataSantri[0].nis,
          rombongan: "T",
          sampai_tanggal: "2023-10-05 17:00:00",
          // sampai_tanggal: "2023-09-30 17:00:00",
          // sejak_tanggal: "2023-09-20 06:00:00",
          sejak_tanggal,
        };
      } else if (santri.jenis_kelamin == "P") {
        form = {
          bermalam: "Y",
          id_alasan_izin: 19,
          id_kabupaten_tujuan: santri?.raw?.id_kabupaten,
          id_kecamatan_tujuan: santri?.raw?.id_kecamatan,
          nis_santri: dataSantri[0].nis,
          rombongan: "T",
          sampai_tanggal: "2023-10-04 17:00:00",
          // sampai_tanggal: "2023-09-30 17:00:00",
          // sejak_tanggal: "2023-09-20 06:00:00",
          sejak_tanggal,
        };
      }
      var userData = jwt_decode(token, { header: true });
      let url;
      if (userData.scope[1].startsWith("wilayah-")) {
        url = `${API_PEDATREN_URL}/wilayah/${userData.scope[1].substring(
          8
        )}/perizinan/santri`;
      } else if (userData.scope[1] != "admin") {
        url = `${API_PEDATREN_URL}/${userData.scope[1]}/perizinan/santri`;
      } else {
        url = `${API_PEDATREN_URL}/perizinan/santri`;
      }
      const response = await axios.post(url, form, {
        headers: {
          "x-token": token,
        },
      });
      const respNew = await axios.get(
        `${API_PEDATREN_URL}/person/${santri.uuid}`,
        {
          headers: {
            "x-token": token,
          },
        }
      );
      await penumpang.update({
        id_perizinan: respNew.data.perizinan_santri[0].id,
      });
      const persyaratan = await Persyaratan.findOne({
        where: {
          penumpang_id: penumpang.id,
        },
      });
      await persyaratan.update({
        is_izin: "Y",
      });
    }
    return true;
  } catch (err) {
    await LogPedatren.create({
      user_uuid: userUuid,
      message: `${niup} | ${
        err.response ? err.response.data.message : err.message
      }`,
    });
    return false;
  }
}

async function konfirmasiIzin(idIzin, idPenumpang, token) {
  try {
    const form = {
      disetujui: "Y",
      keterangan: "Berhak Melaksanakan Libur Maulid 1445 H",
    };
    var userData = jwt_decode(token, { header: true });
    let url;
    if (userData.scope[1] != "admin") {
      url = `${API_PEDATREN_URL}/${userData.scope[1]}/perizinan/santri/${idIzin}/persetujuan`;
    } else {
      url = `${API_PEDATREN_URL}/perizinan/santri/${idIzin}/persetujuan`;
    }
    const response = await axios.put(url, form, {
      headers: {
        "x-token": token,
      },
    });
    const persyaratan = await Persyaratan.findOne({
      where: {
        penumpang_id: idPenumpang,
      },
    });
    await persyaratan.update({
      is_konfirmasi: "Y",
    });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  allIzin: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [{ status_bayar: "lunas" }, { status_bayar: "lebih" }],
          // jika admin hanya boleh pengurus putra **SEMENTARA**
          ...(req.role === "admin" && {
            dropspot_id: 106,
          }),
        },
        include: [
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
            where: {
              [Op.or]: [
                {
                  niup: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  nama_lengkap: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
              // jika daerah atau wilayah hanya boleh perempuan **SEMENTARA**
              ...(req.role === "wilayah" && {
                alias_wilayah: req.wilayah,
                jenis_kelamin: "P",
              }),
              ...(req.role === "daerah" && {
                id_blok: req.id_blok,
                jenis_kelamin: "P",
              }),
              ...(req.role === "wilayah" && {
                alias_wilayah: req.wilayah,
              }),
              ...(req.role === "daerah" && {
                id_blok: req.id_blok,
              }),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
            where: {
              lunas_bps: true,
              lunas_kosmara: true,
              tuntas_fa: true,
              bebas_kamtib: true,
              is_izin: "T",
              is_cetak: "T",
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              ...(req.query.area && { area_id: req.query.area }),
              ...(req.query.dropspot && { id: req.query.dropspot }),
            },
          },
        ],
        limit,
        offset,
        order: [["updated_at", "DESC"]],
      });
      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  allKonfir: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [{ status_bayar: "lunas" }, { status_bayar: "lebih" }],
        },
        include: [
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
            where: {
              [Op.or]: [
                {
                  niup: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  nama_lengkap: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
              ...(req.role === "biktren" ||
                (req.role === "admin" && {
                  // jika biktren hanya boleh putra **SEMENTARA**
                  // jenis_kelamin: req.jenis_kelamin,
                  jenis_kelamin: "L",
                })),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
            where: {
              lunas_bps: true,
              lunas_kosmara: true,
              tuntas_fa: true,
              bebas_kamtib: true,
              is_izin: "Y",
              is_konfirmasi: "T",
              is_cetak: "T",
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              ...(req.query.area && { area_id: req.query.area }),
              ...(req.query.dropspot && { id: req.query.dropspot }),
            },
          },
        ],
        limit,
        offset,
        order: [["updated_at", "DESC"]],
      });
      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  allSurat: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [{ status_bayar: "lunas" }, { status_bayar: "lebih" }],
        },
        include: [
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
            where: {
              [Op.or]: [
                {
                  niup: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  nama_lengkap: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
              ...(req.role === "wilayah" && {
                alias_wilayah: req.wilayah,
              }),
              ...(req.role === "daerah" && {
                id_blok: req.id_blok,
              }),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
            where: {
              lunas_bps: true,
              lunas_kosmara: true,
              tuntas_fa: true,
              bebas_kamtib: true,
              is_izin: "Y",
              is_konfirmasi: "Y",
              ...(req.query.cetak && {
                is_cetak: req.query.cetak,
              }),
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              ...(req.query.area && { area_id: req.query.area }),
              ...(req.query.dropspot && { id: req.query.dropspot }),
            },
          },
        ],
        limit,
        offset,
        order: [["updated_at", "DESC"]],
      });
      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  tautkanPedatren: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!user) {
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = validation.kaitkanPedatren.validate(req.body);

        if (error) {
          responseHelper.badRequest(req, res, error.message);
        } else {
          const authString = `${value.username}:${value.password}`;
          const base64Auth = Buffer.from(authString).toString("base64");
          const config = {
            headers: {
              Authorization: `Basic ${base64Auth}`,
            },
          };
          const response = await axios.get(
            `${API_PEDATREN_URL}/auth/login`,
            config
          );
          value.password = btoa(value.password);
          await user.update({
            username_pedatren: value.username,
            password_pedatren: value.password,
          });
          logger.loggerAdUp(req);
          res.status(201).json({
            value,
            token: response.headers["x-token"],
          });
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  hapusPedatren: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!user) {
        responseHelper.notFound(req, res);
      } else {
        await user.update({
          username_pedatren: null,
          password_pedatren: null,
        });
        logger.loggerAdUp(req);
        res.status(201).json({
          status: "ok",
        });
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  loginPedatren: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!user) {
        responseHelper.notFound(req, res);
      } else {
        if (!user.username_pedatren && user.password_pedatren) {
          responseHelper.badRequest(
            req,
            res,
            "akun anda belum terkait dengan pedatren"
          );
        } else {
          const pass = atob(user.password_pedatren);
          const authString = `${user.username_pedatren}:${pass}`;
          const base64Auth = Buffer.from(authString).toString("base64");
          const config = {
            headers: {
              Authorization: `Basic ${base64Auth}`,
            },
          };
          const response = await axios.get(
            `${API_PEDATREN_URL}/auth/login`,
            config
          );
          logger.loggerSucces(req, 200);
          res
            .status(200)
            .set({
              "x-token": response.headers["x-token"],
            })
            .json({
              status: "ok",
              token: response.headers["x-token"],
            });
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  createIzin: async (req, res) => {
    let success = 0;
    let failed = 0;
    const search = req.query.cari || "";
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = 0 + (page - 1) * limit;
    try {
      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [{ status_bayar: "lunas" }, { status_bayar: "lebih" }],
          // jika admin hanya boleh pengurus putra **SEMENTARA**
          ...(req.role === "admin" && {
            dropspot_id: 106,
          }),
        },
        include: [
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
            where: {
              [Op.or]: [
                {
                  niup: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  nama_lengkap: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
              // jika daerah atau wilayah hanya boleh perempuan **SEMENTARA**
              ...(req.role === "wilayah" && {
                alias_wilayah: req.wilayah,
                jenis_kelamin: "P",
              }),
              ...(req.role === "daerah" && {
                id_blok: req.id_blok,
                jenis_kelamin: "P",
              }),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
            where: {
              lunas_bps: true,
              lunas_kosmara: true,
              tuntas_fa: true,
              bebas_kamtib: true,
              is_izin: "T",
              is_cetak: "T",
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              ...(req.query.area && { area_id: req.query.area }),
              ...(req.query.dropspot && { id: req.query.dropspot }),
            },
          },
        ],
        limit,
        offset,
        order: [["updated_at", "DESC"]],
      });
      const token = req.headers["x-pedatren-token"];
      const result = await Promise.all(
        data.rows.map((d) => prosesIzin(d.santri.niup, req.uuid, token))
      );

      const s = result.filter((r) => r).length;
      const f = result.filter((r) => !r).length;

      success += s;
      failed += f;
      logger.loggerSucces(req, 200);
      res.status(200).json({
        code: 200,
        message: "Berhasil membuat data perizinan di PEDATREN",
        data: {
          send: data.count,
          process: result.length,
          success,
          failed,
        },
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  confirmIzin: async (req, res) => {
    const search = req.query.cari || "";
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = 0 + (page - 1) * limit;
    try {
      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [{ status_bayar: "lunas" }, { status_bayar: "lebih" }],
        },
        include: [
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
            where: {
              [Op.or]: [
                {
                  niup: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  nama_lengkap: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
              ...(req.role === "biktren" ||
                (req.role === "admin" && {
                  // jika biktren hanya boleh putra **SEMENTARA**
                  // jenis_kelamin: req.jenis_kelamin,
                  jenis_kelamin: "L",
                })),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
            where: {
              lunas_bps: true,
              lunas_kosmara: true,
              tuntas_fa: true,
              bebas_kamtib: true,
              is_izin: "Y",
              is_konfirmasi: "T",
              is_cetak: "T",
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              ...(req.query.area && { area_id: req.query.area }),
              ...(req.query.dropspot && { id: req.query.dropspot }),
            },
          },
        ],
        limit,
        offset,
        order: [["updated_at", "DESC"]],
      });
      const token = req.headers["x-pedatren-token"];
      await Promise.all(
        data.rows.map((d) => konfirmasiIzin(d.id_perizinan, d.id, token))
      );
      logger.loggerSucces(req, 200);
      res.status(200).json({
        code: 200,
        message: "Berhasil konfirmasi data perizinan di PEDATREN",
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  viewLog: async (req, res) => {
    try {
      const logs = await LogPedatren.findAll({
        where: {
          user_uuid: req.uuid,
        },
        order: [["created_at", "DESC"]],
      });
      logger.loggerSucces(req, 200);
      res.status(200).json(logs);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getQrIzin: async (req, res) => {
    try {
      const santri = await axios.get(
        API_PEDATREN_URL + "/person/niup/" + req.params.niup,
        {
          headers: {
            "x-token": req.headers["x-token"],
          },
        }
      );

      var userData = jwt_decode(req.headers["x-token"], { header: true });
      let url;
      if (userData.scope[1].startsWith("wilayah-")) {
        url = `${API_PEDATREN_URL}/wilayah/${userData.scope[1].substring(
          8
        )}/perizinan/santri/${santri.data.perizinan_santri[0].id}`;
      } else if (userData.scope[1] != "admin") {
        url = `${API_PEDATREN_URL}/${userData.scope[1]}/perizinan/santri/${santri.data.perizinan_santri[0].id}`;
      } else {
        url = `${API_PEDATREN_URL}/perizinan/santri/${santri.data.perizinan_santri[0].id}`;
      }
      const perizinan = await axios.get(url, {
        headers: {
          "x-token": req.headers["x-token"],
        },
      });

      const response = await axios.get(
        API_PEDATREN_URL + perizinan.data.qrcode_url,
        {
          headers: {
            "x-token": req.headers["x-token"],
          },
          responseType: "arraybuffer",
        }
      );
      logger.loggerSucces(req, 200);
      responseHelper.imageQRCode(req, res, response.data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateStatusCetak: async (req, res) => {
    try {
      await Persyaratan.update(
        {
          is_cetak: req.body.status,
        },
        {
          where: {
            id: req.body.id_persyaratan,
          },
        }
      );
      responseHelper.createdOrUpdated(req, res);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
