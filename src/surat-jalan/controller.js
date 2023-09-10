const { Op } = require("sequelize");
const {
  Penumpang,
  Santri,
  Persyaratan,
  User,
  LogPedatren,
} = require("../../models");
const responseHelper = require("../../helpers/response-helper");
const validation = require("../../validations/surat-jalan-validation");
const axios = require("axios");
const { API_PEDATREN_URL } = process.env;
const logger = require("../../helpers/logger");
const jwt_decode = require("jwt-decode");
const PDFDocument = require("pdfkit");
const fs = require("fs");

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
      santri.raw = JSON.parse(santri?.raw);
      const dataSantri = santri?.raw?.santri.filter(
        (item) => item.tanggal_akhir === null
      );
      const form = {
        bermalam: "Y",
        id_alasan_izin: 19,
        id_kabupaten_tujuan: santri?.raw?.id_kabupaten,
        id_kecamatan_tujuan: santri?.raw?.id_kecamatan,
        nis_santri: dataSantri[0].nis,
        rombongan: "T",
        sampai_tanggal: "2023-09-21 17:00:00",
        sejak_tanggal: "2023-09-11 06:00:00",
      };
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
              ...(req.query.cetak && {
                is_cetak: req.query.cetak,
              }),
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
          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      console.log(err);
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
            });
        }
      }
    } catch (err) {
      console.log(err);
      responseHelper.serverError(req, res, err.message);
    }
  },

  createIzin: async (req, res) => {
    let success = 0;
    let failed = 0;
    try {
      const data = [
        { niup: 11520107628 },
        { niup: 21620704075 },
        { niup: 11520105296 },
      ];
      const token = req.headers["x-pedatren-token"];
      const result = await Promise.all(
        data.map((d) => prosesIzin(d.niup, req.uuid, token))
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
          send: data.length,
          process: result.length,
          success,
          failed,
        },
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  // cetakPdf: async (req, res) => {
  //   try {
  //     const search = req.query.cari || "";
  //     const page = req.query.page || 1;
  //     const limit = parseInt(req.query.limit) || 3;
  //     const offset = 0 + (page - 1) * limit;

  //     const data = await Penumpang.findAndCountAll({
  //       where: {
  //         [Op.or]: [{ status_bayar: "lunas" }, { status_bayar: "lebih" }],
  //       },
  //       include: [
  //         {
  //           model: Santri,
  //           as: "santri",
  //           attributes: { exclude: ["raw"] },
  //           where: {
  //             [Op.or]: [
  //               {
  //                 niup: {
  //                   [Op.like]: `%${search}%`,
  //                 },
  //               },
  //               {
  //                 nama_lengkap: {
  //                   [Op.like]: `%${search}%`,
  //                 },
  //               },
  //             ],
  //             ...(req.role === "wilayah" && {
  //               alias_wilayah: req.wilayah,
  //             }),
  //             ...(req.query.wilayah && {
  //               alias_wilayah: req.query.wilayah,
  //             }),
  //             ...(req.query.blok && {
  //               id_blok: req.query.blok,
  //             }),
  //           },
  //         },
  //         {
  //           model: Persyaratan,
  //           as: "persyaratan",
  //           where: {
  //             lunas_bps: true,
  //             lunas_kosmara: true,
  //             tuntas_fa: true,
  //             bebas_kamtib: true,
  //             is_izin: "Y",
  //             ...(req.query.cetak && {
  //               is_cetak: req.query.cetak,
  //             }),
  //           },
  //         },
  //       ],
  //       limit,
  //       offset,
  //       order: [["updated_at", "DESC"]],
  //     });

  //     const doc = new PDFDocument({ size: [16.5 * 72, 21.5 * 72] });

  //     // Set response header for PDF file
  //     res.setHeader("Content-Type", "application/pdf");
  //     res.setHeader("Content-Disposition", "inline; filename=example.pdf");
  //     // Pipe PDFKit output to response
  //     doc.pipe(res);

  //     data.rows.forEach((item, index) => {
  //       if (index > 0) {
  //         doc.addPage();
  //       }
  //       doc.image("surat-jalan/kop.jpg", {
  //         fit: [400, 300],
  //         align: "center",
  //         valign: "center",
  //       });
  //       doc.fontSize(16).text("SURAT IZIN LIBUR MAULID 1445 H", {
  //         align: "center",
  //         underline: true,
  //       });
  //       doc
  //         .fontSize(12)
  //         .text("NOMOR : NJ-B/0000/A.IX/09.2022", { align: "center" });
  //       doc.moveDown(2);
  //       doc
  //         .fontSize(12)
  //         .text(
  //           "Yang bertanda tangan dibawah ini, Kepala Pondok Pesantren Nurul Jadid Paiton",
  //           { align: "left" }
  //         );
  //       doc.moveDown(2);
  //       doc.fontSize(12).text(`Nama        : ${item.santri?.nama_lengkap}`);
  //       doc.fontSize(12).text(`NIUP         : ${item.santri?.niup}`);
  //       doc.fontSize(12).text(`Wilayah     : ${item.santri?.wilayah}`);
  //       doc.fontSize(12).text(`Daerah      : ${item.santri?.blok}`);
  //       doc.moveDown(2);
  //       doc
  //         .fontSize(14)
  //         .text(
  //           "Santri putri tanggal 9 Rabiul Awal 1445 H/25 September 2023 M s.d.",
  //           {
  //             align: "center",
  //             underline: true,
  //           }
  //         );
  //       doc.fontSize(14).text("18 Rabiul Awal 1445 H/4 Oktober 2023 M.", {
  //         align: "center",
  //       });
  //       doc
  //         .fontSize(14)
  //         .text(
  //           "Santri putra tanggal 10 Rabiul Awal 1445 H/26 September 2023 M s.d.",
  //           {
  //             align: "center",
  //             underline: true,
  //           }
  //         );
  //       doc.fontSize(14).text("19 Rabiul Awal 1445 H/5 Oktober 2023 M.", {
  //         align: "center",
  //       });
  //       doc.moveDown(2);
  //       doc
  //         .fontSize(12)
  //         .text(
  //           "Demikian surat izin ini dibuat dengan sebenarnya dan untuk digunakan sebagaimana mestinya.",
  //           { align: "left" }
  //         );
  //       doc.moveDown(2);
  //       doc.fontSize(12).text("Paiton, 10 Safar 1445 H", { align: "left" });
  //       doc.fontSize(12).text("27 Agustus 2023 M", { align: "left" });
  //       doc.moveDown(1);
  //       doc.fontSize(12).text("Kepala,", { align: "left" });
  //       doc.moveDown(8);
  //       doc.fontSize(12).text("KH. ABD. HAMID WAHID, M.Ag.", { align: "left" });
  //       doc.fontSize(12).text("NIUP. 31820500002", { align: "left" });
  //       doc.moveDown(2);
  //       doc.fontSize(10).text("Keterangan:", { align: "left" });
  //       doc.moveDown(2);
  //       doc
  //         .fontSize(10)
  //         .text(
  //           "1. Kedatangan Santri dan penyerahan surat izin libur ke KAMTIB Wilayah/Daerah selambat-lambatnya pukul 17.00 WIB (Ba’da Maghrib).",
  //           { align: "left" }
  //         );
  //       doc
  //         .fontSize(10)
  //         .text("2. Pusat layanan Pulang Bersama;", { align: "left" });
  //       doc
  //         .fontSize(10)
  //         .text("   a. Informasi Umum : 0888-307-7077", { align: "left" });
  //       doc
  //         .fontSize(10)
  //         .text("   b. Putra : 0896-5479-0122", { align: "left" });
  //       doc
  //         .fontSize(10)
  //         .text("   c. Putri : 0822-3105-8592", { align: "left" });
  //       doc.moveDown(4);
  //       doc.fontSize(10).text("Tanggal Cetak", { align: "right" });
  //       doc.fontSize(10).text("27 Aug 2023 22:32:05 WIB", { align: "right" });
  //     });

  //     doc.end();
  //   } catch (err) {
  //     responseHelper.serverError(req, res, err.message);
  //   }
  // },
};
