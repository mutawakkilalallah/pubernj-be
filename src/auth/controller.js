require("dotenv").config();
const { User, Santri } = require("../../models");
const authValidation = require("../../validations/auth-validation");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const bcrypt = require("bcrypt");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");
const axios = require("axios");
const { API_PEDATREN_URL } = process.env;

module.exports = {
  login: async (req, res) => {
    try {
      const { error, value } = authValidation.login.validate(req.body);
      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        username = value.username;
        password = value.password;

        const data = await User.findOne({
          where: {
            username: username,
          },
        });
        if (!data) {
          responseHelper.forbidden(req, res);
        } else {
          const validPassword = await bcrypt.compare(password, data.password);
          if (!validPassword) {
            responseHelper.unauthorized(req, res);
          } else {
            var pedatrenToken = "";
            if (data.role === "pendamping") {
              const pass = `${data.username}321`;
              const authString = `${data.username}:${pass}`;
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
              await data.update({
                token_pedatren: response.headers["x-token"],
              });
              pedatrenToken = response.headers["x-token"];
            }
            const token = await jwt.sign(
              {
                uuid: data.uuid,
                nama_lengkap: data.nama_lengkap,
                username: data.username,
                jenis_kelamin: data.jenis_kelamin,
                role: data.role,
                wilayah: data.alias_wilayah ? data.alias_wilayah : null,
                id_blok: data.id_blok ? data.id_blok : null,
                area: data.area_id ? data.area_id : null,
                pedatrenToken,
              },
              JWT_SECRET_KEY,
              {
                expiresIn: "6h",
              }
            );
            data.password = null;
            await data.update({
              is_login: true,
            });
            logger.loggerAuth(req, data);
            responseHelper.auth(req, res, token, data);
          }
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  loginPedatren: async (req, res) => {
    try {
      const auth = req.headers.authorization.split(" ")[1];
      const decodedAuth = Buffer.from(auth, "base64").toString();
      const [username, password] = decodedAuth.split(":");
      const authToPedatren =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");
      const resp = await axios.get(`${API_PEDATREN_URL}/auth/login`, {
        headers: { Authorization: authToPedatren },
      });
      res
        .status(200)
        .set({
          "x-token": resp.headers["x-token"],
        })
        .json({
          status: "sukses",
          deskripsi: "Sukses login.",
          token_pedatren: resp.headers["x-token"],
        });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
  generateIzin: async (req, res) => {
    try {
      const resp = await axios.get(
        `${API_PEDATREN_URL}/person/1ccc14d9-f865-44a4-9d4f-f309493e6c3b`,
        {
          headers: {
            "x-token": req.headers["x-token"],
          },
        }
      );
      if (resp.status === 200) {
        const payload = {
          bermalam: "Y",
          id_alasan_izin: 19,
          id_kabupaten_tujuan: resp.data.id_kabupaten,
          id_kecamatan_tujuan: resp.data.id_kecamatan,
          nis_santri: resp?.data?.santri[resp?.data?.santri?.length - 1].nis,
          rombongan: "T",
          sampai_tanggal: "2023-09-07 17:00:00",
          sejak_tanggal: "2023-08-28 06:00:00",
        };
        const respIzin = await axios.post(
          `${API_PEDATREN_URL}/biktren-putra/perizinan/santri`,
          payload,
          {
            headers: {
              "x-token": req.headers["x-token"],
            },
          }
        );
        responseHelper.createdOrUpdated(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.response.data.message);
    }
  },
};
