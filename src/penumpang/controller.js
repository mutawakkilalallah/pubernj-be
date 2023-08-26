const { Op } = require("sequelize");
const {
  Penumpang,
  Area,
  Dropspot,
  Santri,
  Armada,
  User,
  Periode,
  Persyaratan,
} = require("../../models");
const penumpangValidation = require("../../validations/penumpang-validation");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");
const ExcelJS = require("exceljs");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [
            {
              "$santri.niup$": {
                [Op.like]: `%${search}%`,
              },
            },
            {
              "$santri.nama_lengkap$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
          ...(req.query.masuk_bus === "n" && {
            armada_id: {
              [Op.is]: null,
            },
          }),
          ...(req.query.pembayaran && {
            $status_bayar$: req.query.pembayaran,
          }),
          ...(req.query.jenis_kelamin && {
            "$santri.jenis_kelamin$": req.query.jenis_kelamin,
          }),
          ...(req.query.dropspot && { dropspot_id: req.query.dropspot }),
          ...(req.query.armada && { armada_id: req.query.armada }),
          ...(req.query.area && { "$dropspot.area_id$": req.query.area }),
          ...(req.query.blok && {
            "$santri.id_blok$": req.query.blok,
          }),
          ...(req.query.wilayah && {
            "$santri.alias_wilayah$": req.query.wilayah,
          }),
          ...(req.role === "daerah" && {
            "$santri.id_blok$": req.id_blok,
          }),
          ...(req.role === "wilayah" && {
            "$santri.alias_wilayah$": req.wilayah,
          }),
          ...(req.role === "pendamping" && {
            "$armada.user_uuid$": req.uuid,
          }),
          ...(req.role === "p4nj" && {
            "$dropspot.area_id$": req.area,
          }),
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
            include: {
              model: Area,
              as: "area",
            },
          },
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
          },
          {
            model: Armada,
            as: "armada",
          },
          {
            model: Periode,
            as: "periode",
            where: {
              is_active: true,
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
          },
        ],
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      const filterArea = await Area.findAll({
        where: {
          ...(req.role === "p4nj" && { id: req.area }),
        },
      });
      data.rows.map((d) => {
        if (d.dropspot) {
          d.dropspot.area.no_hp = `+62${d.dropspot.area.no_hp}`;
        }
      });
      responseHelper.allData(req, res, page, limit, data, { area: filterArea });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getByUuid: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          santri_uuid: req.params.uuid,
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
            include: {
              model: Area,
              as: "area",
            },
          },
          {
            model: Armada,
            as: "armada",
            include: {
              model: User,
              as: "user",
            },
          },
          {
            model: Santri,
            as: "santri",
          },
          {
            model: Persyaratan,
            as: "persyaratan",
          },
        ],
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        if (data.dropspot) {
          data.dropspot.area.no_hp = `+62${data.dropspot.area.no_hp}`;
        }
        if (data.armada) {
          if (data.armada.user) {
            data.armada.user.no_hp = `+62${data.armada.user.no_hp}`;
          }
        }
        data.santri.raw = JSON.parse(data.santri.raw);
        responseHelper.oneData(req, res, data);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateArmada: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateArmada.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Penumpang.update(
          {
            armada_id: req.params.id,
          },
          {
            where: {
              id: value.id_penumpang,
            },
          }
        );

        responseHelper.createdOrUpdated(req, res);
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  deleteArmada: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateArmada.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Penumpang.update(
          {
            armada_id: null,
          },
          {
            where: {
              id: value.id_penumpang,
            },
          }
        );

        responseHelper.createdOrUpdated(req, res);
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateDropspot: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateDropspot.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        const penumpang = await Penumpang.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (penumpang.armada_id != null) {
          responseHelper.badRequest(
            req,
            res,
            "penumpang ini sudah dimasukkan ke dalam armada"
          );
        } else {
          await penumpang.update({
            dropspot_id: value.dropspot_id,
          });
          responseHelper.createdOrUpdated(req, res);
        }
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  deleteRombongan: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          santri_uuid: req.params.uuid,
        },
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        const penumpang = await Penumpang.findOne({
          where: {
            santri_uuid: req.params.uuid,
          },
        });
        await Persyaratan.destroy({
          where: {
            penumpang_id: penumpang.id,
          },
        });
        await penumpang.destroy();

        await Santri.update(
          {
            status_kepulangan: "non-rombongan",
          },
          {
            where: {
              uuid: req.params.uuid,
            },
          }
        );
        responseHelper.deleted(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updatePembayaran: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updatePembayaran.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        const penumpang = await Penumpang.findOne({
          where: {
            id: req.params.id,
          },
          include: {
            model: Dropspot,
            as: "dropspot",
          },
        });

        if (!penumpang) {
          responseHelper.notFound(req, res);
        } else {
          penumpang.jumlah_bayar = value.jumlah_bayar;
          if (penumpang.dropspot.harga === value.jumlah_bayar) {
            penumpang.status_bayar = "lunas";
          } else if (penumpang.dropspot.harga < value.jumlah_bayar) {
            penumpang.status_bayar = "lebih";
          } else if (
            penumpang.dropspot.harga != 0 &&
            value.jumlah_bayar === 0
          ) {
            penumpang.status_bayar = "belum-lunas";
          } else if (
            penumpang.dropspot.harga != 0 &&
            penumpang.dropspot.harga > value.jumlah_bayar
          ) {
            penumpang.status_bayar = "kurang";
          }
          await penumpang.save();
          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateKeberangkatan: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateKeberangkatan.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Penumpang.update(
          {
            status_keberangkatan: value.status_keberangkatan,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        responseHelper.createdOrUpdated(req, res);
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  unduhTemplate: async (req, res) => {
    // Buat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Set header row
    worksheet.mergeCells("A1:B1");
    worksheet.getCell("A1").value = "NAMA INSTITUSI";
    worksheet.getCell("C1").value =
      "NURUL JADID PAITON PROBOLINGGO, PONDOK PESANTREN";
    worksheet.mergeCells("A2:B2");
    worksheet.getCell("A2").value = "NAMA TAGIHAN";
    worksheet.getCell("C2").value = "PUBER MAULID 2023";

    // Buat baris kosong
    worksheet.addRow([]);

    // Set kolom A dan B pada baris 4 dan 5
    worksheet.mergeCells("A4:A5");
    worksheet.getCell("A4").value = "NO";
    worksheet.mergeCells("B4:B5");
    worksheet.getCell("B4").value = "ID AKUN";
    worksheet.mergeCells("C4:C5");
    worksheet.getCell("C4").value = "NAMA";
    worksheet.mergeCells("D4:D5");
    worksheet.getCell("D4").value = "GRAND TOTAL";
    worksheet.mergeCells("E4:G4");
    worksheet.getCell("E4").value = "PUBER MAULID 2023";
    worksheet.getCell("E5").value = "NOMINAL";
    worksheet.getCell("F5").value = "DISKON";
    worksheet.getCell("G5").value = "TOTAL";
    worksheet.mergeCells("H4:J4");
    worksheet.getCell("H4").value = "ADMIN PUBER MAULID 2023";
    worksheet.getCell("H5").value = "NOMINAL";
    worksheet.getCell("I5").value = "DISKON";
    worksheet.getCell("J5").value = "TOTAL";

    // Mengisi data pada baris 6 dan seterusnya (disesuaikan dengan data Anda)

    const data = await Penumpang.findAll({
      attributes: ["id", "santri_uuid", "dropspot_id"],
      include: [
        {
          model: Santri,
          as: "santri",
          attributes: ["uuid", "niup", "nama_lengkap"],
        },
        {
          model: Dropspot,
          as: "dropspot",
          attributes: ["id", "harga"],
        },
      ],
    });

    data.forEach((rowData, index) => {
      worksheet.addRow([
        index + 1,
        rowData.santri.niup,
        rowData.santri.nama_lengkap,
        rowData.dropspot.harga + 1000,
        400000,
        400000 - rowData.dropspot.harga,
        rowData.dropspot.harga,
        1000,
        0,
        1000,
      ]);
    });

    // Simpan file Excel ke dalam buffer
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        // Set header HTTP untuk melakukan download file
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="output.xlsx"'
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // Kirim buffer sebagai respons
        logger.loggerSucces(req, 200);
        res.send(buffer);
      })
      .catch((err) => {
        console.error("Terjadi kesalahan:", err);
        res.status(500).send("Terjadi kesalahan saat membuat file Excel.");
      });
  },

  importBayar: async (req, res) => {
    const excelBuffer = req.file.buffer;

    const workbook = new ExcelJS.Workbook();
    workbook.xlsx
      .load(excelBuffer)
      .then(() => {
        const worksheet = workbook.getWorksheet("Sheet 1"); // Pastikan sesuai dengan nama worksheet yang Anda gunakan
        const data = [];

        // Loop melalui baris 6 ke atas dan ambil kolom B dan D
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber >= 6) {
            const columnBValue = row.getCell("B").value;
            const columnDValue = row.getCell("D").value;

            // Pastikan nilai tidak kosong sebelum menambahkannya ke array
            if (columnBValue !== null && columnDValue !== null) {
              data.push({ niup: columnBValue, total_bayar: columnDValue });
            }
          }
        });
        const promises = data.map(async (d) => {
          try {
            const penumpang = await Penumpang.findOne({
              include: [
                {
                  model: Santri,
                  as: "santri",
                  where: {
                    niup: d.niup,
                  },
                },
                {
                  model: Dropspot,
                  as: "dropspot",
                },
              ],
            });

            if (penumpang) {
              // // Lakukan update pada data yang diperoleh dari Excel
              penumpang.jumlah_bayar = d.total_bayar;
              if (penumpang.dropspot.harga === d.total_bayar) {
                penumpang.status_bayar = "lunas";
              } else if (penumpang.dropspot.harga < d.total_bayar) {
                penumpang.status_bayar = "lebih";
              } else if (penumpang.dropspot.harga != 0 && d.total_bayar === 0) {
                penumpang.status_bayar = "belum-lunas";
              } else if (
                penumpang.dropspot.harga != 0 &&
                penumpang.dropspot.harga > d.total_bayar
              ) {
                penumpang.status_bayar = "kurang";
              }
              await penumpang.save();
            } else {
              return `Data dengan niup ${d.niup} tidak ditemukan.`;
            }
          } catch (error) {
            return `Terjadi kesalahan: ${error.message}`;
          }
        });

        Promise.all(promises)
          .then((results) => {
            results.forEach((result) => {
              //
            });
          })
          .catch((error) => {
            //
          });

        responseHelper.createdOrUpdated(req, res);
      })
      .catch((err) => {
        responseHelper.serverError(
          req,
          res,
          "Terjadi kesalahan saat membaca file excel"
        );
      });
  },

  suratJalan: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          "$santri.niup$": req.params.niup,
        },
        include: [
          {
            model: Santri,
            as: "santri",
          },
        ],
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        data.santri.raw = JSON.parse(data.santri.raw);
        responseHelper.oneData(req, res, {
          nama_lengkap: data.santri.nama_lengkap,
          niup: data.santri.niup,
          wilayah: data.santri.wilayah,
          blok: data.santri.blok,
          alamat: `${data.santri.raw.kecamatan}, ${data.santri.raw.kabupaten}, ${data.santri.raw.provinsi}. ${data.santri.raw.kodepos}.`,
        });
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  generateQR: async (req, res) => {
    try {
      // Isi data yang ingin dienkripsi menjadi QR code
      const data = req.params.niup;

      const penumpang = await Penumpang.findOne({
        include: [
          {
            model: Santri,
            as: "santri",
            where: {
              niup: req.params.niup,
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
          },
        ],
      });

      Persyaratan.update(
        {
          izin_pedatren: true,
        },
        {
          where: {
            penumpang_id: penumpang.id,
          },
        }
      );

      // Mengatur opsi margin/padding menjadi 0
      const qrCodeOptions = {
        margin: 0,
        width: 128,
        height: 128,
        maskPattern: 4,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      };

      // Generate QR code
      const qrCodeImage = await qrcode.toDataURL(data, qrCodeOptions);

      // Menyimpan QR code ke dalam berkas di direktori qrcode
      const qrCodePath = path.join(
        __dirname,
        "berkas",
        "qrcode",
        `${req.params.niup}.png`
      );

      // Menulis gambar QR code ke dalam berkas
      await fs.writeFileSync(
        qrCodePath,
        qrCodeImage.replace(/^data:image\/png;base64,/, ""),
        "base64"
      );

      responseHelper.createdOrUpdated(req, res);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getQR: async (req, res) => {
    try {
      const qrCodePath = path.join(
        __dirname,
        "berkas",
        "qrcode",
        `${req.params.niup}.png`
      );
      const qrCodeBuffer = fs.readFileSync(qrCodePath);

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; ${req.params.niup}.png`,
      });
      res.end(qrCodeBuffer);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getAllPersyaratan: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [
            {
              "$santri.niup$": {
                [Op.like]: `%${search}%`,
              },
            },
            {
              "$santri.nama_lengkap$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
          ...(req.query.jenis_kelamin && {
            "$santri.jenis_kelamin$": req.query.jenis_kelamin,
          }),
          ...(req.query.blok && {
            "$santri.id_blok$": req.query.blok,
          }),
          ...(req.query.wilayah && {
            "$santri.alias_wilayah$": req.query.wilayah,
          }),
          ...(req.role === "daerah" && {
            "$santri.id_blok$": req.id_blok,
          }),
          ...(req.role === "wilayah" && {
            "$santri.alias_wilayah$": req.wilayah,
          }),
        },
        include: [
          {
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
          },
          {
            model: Periode,
            as: "periode",
            where: {
              is_active: true,
            },
          },
          {
            model: Persyaratan,
            as: "persyaratan",
            where: {
              ...(req.query.lunas_bps && {
                lunas_bps: req.query.lunas_bps,
              }),
              ...(req.query.lunas_kosmara && {
                lunas_kosmara: req.query.lunas_kosmara,
              }),
              ...(req.query.tuntas_fa && {
                tuntas_fa: req.query.tuntas_fa,
              }),
              ...(req.query.bebas_kamtib && {
                bebas_kamtib: req.query.bebas_kamtib,
              }),
            },
          },
        ],
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  ubahPersyaratan: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.ubahPersyaratan.validate(
        req.body
      );
      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        const persyaratan = await Persyaratan.findOne({
          where: {
            penumpang_id: req.params.id,
          },
        });
        if (!persyaratan) {
          responseHelper.notFound(req, res);
        } else {
          if (value.type === "bps") {
            persyaratan.lunas_bps = !persyaratan.lunas_bps;
          } else if (value.type === "kosmara") {
            persyaratan.lunas_kosmara = !persyaratan.lunas_kosmara;
          } else if (value.type === "fa") {
            persyaratan.tuntas_fa = !persyaratan.tuntas_fa;
          } else if (value.type === "kamtib") {
            persyaratan.bebas_kamtib = !persyaratan.bebas_kamtib;
          }
          await persyaratan.save();
          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
