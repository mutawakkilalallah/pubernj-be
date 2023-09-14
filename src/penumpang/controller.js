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
  Berkas,
  sequelize,
} = require("../../models");
const penumpangValidation = require("../../validations/penumpang-validation");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");
const ExcelJS = require("exceljs");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const util = require("util");
const { not } = require("joi");

// storage untuk surat keterangan
const storageBerkas = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `berkas/surat-keterangan`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${req.params.uuid}.${ext}`);
  },
});

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
          ...(req.query.tagihan === "T" && {
            tagihan_ebekal: 0,
          }),
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
          // ...(req.query.hak_pulang && {
          //   [Op.or]: [
          //     {
          //       status_bayar:
          //         req.query.hak_pulang === "true"
          //           ? { [Op.in]: ["lunas", "lebih"] }
          //           : { [Op.notIn]: ["lunas", "lebih"] },
          //     },
          //   ],
          // }),
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
            where: {
              ...(req.query.tagihan === "T" && {
                harga: {
                  [Op.not]: 0,
                },
              }),
            },
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
            where: {
              ...(req.query.hak_pulang && {
                lunas_bps: req.query.hak_pulang,
                lunas_kosmara: req.query.hak_pulang,
                tuntas_fa: req.query.hak_pulang,
                bebas_kamtib: req.query.hak_pulang,
              }),
            },
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
          {
            model: Berkas,
            as: "berkas",
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
      attributes: ["id", "santri_uuid", "dropspot_id", "tagihan_ebekal"],
      where: {
        ...(req.query.blok && {
          "$santri.id_blok$": req.query.blok,
        }),
        ...(req.query.wilayah && {
          "$santri.alias_wilayah$": req.query.wilayah,
        }),
        ...(req.query.pembayaran && {
          $status_bayar$: req.query.pembayaran,
        }),
        ...(req.query.jenis_kelamin && {
          "$santri.jenis_kelamin$": req.query.jenis_kelamin,
        }),
        ...(req.query.tagihan === "T" && {
          tagihan_ebekal: 0,
        }),
      },
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
          where: {
            ...(req.query.tagihan === "T" && {
              harga: {
                [Op.not]: 0,
              },
            }),
          },
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
        const worksheet = workbook.getWorksheet("data_invoice"); // Pastikan sesuai dengan nama worksheet yang Anda gunakan
        const data = [];

        // Loop melalui baris 6 ke atas dan ambil kolom B dan D
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber >= 2) {
            const columnCValue = row.getCell("C").value;
            const columnLValue = row.getCell("L").value;
            const columnJValue = row.getCell("J").value;
            // Pastikan nilai tidak kosong sebelum menambahkannya ke array
            if (
              columnCValue !== null &&
              columnLValue !== null &&
              columnJValue === "Lunas"
            ) {
              data.push({
                niup: columnCValue,
                total_bayar: columnLValue - 1000,
              });
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

  compareTagihan: async (req, res) => {
    const excelBuffer = req.file.buffer;

    const workbook = new ExcelJS.Workbook();
    workbook.xlsx
      .load(excelBuffer)
      .then(() => {
        const worksheet = workbook.getWorksheet("data_invoice"); // Pastikan sesuai dengan nama worksheet yang Anda gunakan
        const data = [];

        // Loop melalui baris 6 ke atas dan ambil kolom B dan D
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber >= 2) {
            const columnCValue = row.getCell("C").value;
            const columnIValue = row.getCell("I").value;
            // Pastikan nilai tidak kosong sebelum menambahkannya ke array
            if (columnCValue !== null && columnIValue !== null) {
              data.push({
                niup: columnCValue,
                tagihan_ebekal: columnIValue - 1000,
              });
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
                  attributes: { exclude: ["raw"] },
                  where: {
                    niup: d.niup,
                  },
                },
              ],
            });

            if (penumpang) {
              // // Lakukan update pada data yang diperoleh dari Excel
              penumpang.tagihan_ebekal = d.tagihan_ebekal;
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
          alamat: `${data.santri.raw.kecamatan}, ${data.santri.raw.kabupaten}, ${data.santri.raw.provinsi}.`,
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

  allCompare: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const where = {
        tagihan_ebekal: {
          [Op.ne]: sequelize.col("dropspot.harga"),
        },
      };

      const andConditions = [];

      if (req.query.nominal === "Y") {
        andConditions.push({
          tagihan_ebekal: {
            [Op.not]: 0,
          },
        });
      }

      if (req.query.pembayaran) {
        where.status_bayar = req.query.pembayaran;
      }

      if (andConditions.length > 0) {
        where[Op.and] = andConditions;
      }

      const data = await Penumpang.findAndCountAll({
        where: where,
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
              ...(req.query.jenis_kelamin && {
                jenis_kelamin: req.query.jenis_kelamin,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
            },
          },
          {
            model: Periode,
            as: "periode",
            where: {
              is_active: true,
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              ...(req.query.nominal === "Y" && {
                harga: {
                  [Op.not]: 0,
                },
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

  allNoTagihan: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          tagihan_ebekal: 0,
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
              ...(req.query.jenis_kelamin && {
                jenis_kelamin: req.query.jenis_kelamin,
              }),
              ...(req.query.blok && {
                id_blok: req.query.blok,
              }),
              ...(req.query.wilayah && {
                alias_wilayah: req.query.wilayah,
              }),
            },
          },
          {
            model: Periode,
            as: "periode",
            where: {
              is_active: true,
            },
          },
          {
            model: Dropspot,
            as: "dropspot",
            where: {
              harga: {
                [Op.not]: 0,
              },
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

  exportExcel: async (req, res) => {
    // Buat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const data = await Penumpang.findAll({
      where: {
        ...(req.query.pembayaran && {
          $status_bayar$: req.query.pembayaran,
        }),
        ...(req.query.jenis_kelamin && {
          "$santri.jenis_kelamin$": req.query.jenis_kelamin,
        }),
        ...(req.query.dropspot && { dropspot_id: req.query.dropspot }),
        ...(req.query.area && { "$dropspot.area_id$": req.query.area }),
        ...(req.query.blok && {
          "$santri.id_blok$": req.query.blok,
        }),
        ...(req.query.wilayah && {
          "$santri.alias_wilayah$": req.query.wilayah,
        }),
      },
      include: [
        {
          model: Santri,
          as: "santri",
          attributes: { exclude: ["raw"] },
        },
        {
          model: Persyaratan,
          as: "persyaratan",
        },
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
      ],
      limit: parseInt(req.query.limit),
      order: [["updated_at", "DESC"]],
    });

    // Menambahkan header sesuai dengan parameter
    const header = [];
    header.push({ header: "No", key: "no" });
    header.push({ header: "NIUP", key: "niup" });
    header.push({ header: "Nama", key: "nama" });
    header.push({ header: "Jenis Kelamin", key: "jk" });

    if (req.query.in_domisili === "true") {
      header.push({ header: "Wilayah", key: "wilayah" });
      header.push({ header: "Daerah", key: "blok" });
    }

    if (req.query.in_alamat === "true") {
      header.push({ header: "Kecamatan", key: "kecamatan" });
      header.push({ header: "Kabupaten", key: "kabupaten" });
      header.push({ header: "Provinsi", key: "provinsi" });
    }

    if (req.query.in_dropspot === "true") {
      header.push({ header: "Area", key: "area" });
      header.push({ header: "Dropspot", key: "dropspot" });
      header.push({ header: "Tarif", key: "harga" });
    }

    if (req.query.in_pembayaran === "true") {
      header.push({ header: "Jumlah Bayar", key: "jumlah_bayar" });
      header.push({ header: "Status Pembayaran", key: "status_bayar" });
    }

    if (req.query.in_persyaratan === "true") {
      header.push({ header: "BPS", key: "bps" });
      header.push({ header: "KOS MAKAN", key: "kosmara" });
      header.push({ header: "FA", key: "fa" });
      header.push({ header: "KAMTIB", key: "kamtib" });
    }

    if (req.query.in_armada === "true") {
      header.push({ header: "Armada", key: "armada" });
      header.push({ header: "Pendamping", key: "pendamping" });
      header.push({ header: "Nomor HP", key: "hp" });
    }

    worksheet.columns = header;

    data.forEach((d, index) => {
      const row = {
        no: index + 1,
        niup: d?.santri?.niup,
        nama: d?.santri?.nama_lengkap,
        jk: d?.santri?.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
      };

      if (req.query.in_domisili === "true") {
        row["wilayah"] = d?.santri?.wilayah;
        row["blok"] = d?.santri?.blok;
      }

      if (req.query.in_alamat === "true") {
        row["kecamatan"] = d?.santri?.kecamatan;
        row["kabupaten"] = d?.santri?.kabupaten;
        row["provinsi"] = d?.santri?.provinsi;
      }

      if (req.query.in_dropspot === "true") {
        row["area"] = d?.dropspot?.area?.nama;
        row["dropspot"] = d?.dropspot?.nama;
        row["harga"] = d?.dropspot?.harga;
      }

      if (req.query.in_pembayaran === "true") {
        row["jumlah_bayar"] = d?.jumlah_bayar;
        row["status_bayar"] =
          d?.status_bayar != "belum-lunas"
            ? d?.status_bayar?.toUpperCase()
            : "BELUM LUNAS";
      }

      if (req.query.in_persyaratan === "true") {
        row["bps"] =
          d?.persyaratan?.lunas_bps === true ? "LUNAS" : "BELUM LUNAS";
        row["kosmara"] =
          d?.persyaratan?.lunas_kosmara === true ? "LUNAS" : "BELUM LUNAS";
        row["fa"] =
          d?.persyaratan?.tuntas_fa === true ? "TUNTAS" : "BELUM TUNTAS";
        row["kamtib"] =
          d?.persyaratan?.bebas_kamtib === true ? "BEBAS" : "BELUM BEBAS";
      }

      if (req.query.in_armada === "true") {
        row["armada"] = d?.armada?.nama;
        row["pendamping"] = d?.armada?.user?.nama_lengkap;
        row["hp"] = d?.armada?.user?.no_hp;
      }

      worksheet.addRow(row);
    });

    // Simpan file Excel ke dalam buffer
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        // Set header HTTP untuk melakukan download file
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="data-penumpang.xlsx"'
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

  uploadBerkas: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          santri_uuid: req.params.uuid,
        },
      });
      if (!data) {
        return responseHelper.notFound(req, res);
      }

      const multerUpload = util.promisify(
        multer({ storage: storageBerkas }).single("berkas")
      );

      await multerUpload(req, res);

      let filePath;

      if (req.file) {
        filePath = req.file.path;
        await Berkas.create({
          penumpang_id: data.id,
          type: req.body.type,
          description: req.body.description,
          path: filePath,
        });

        return responseHelper.createdOrUpdated(req, res);
      } else {
        return responseHelper.badRequest(req, res, "file harus di isi");
      }
    } catch (err) {
      return responseHelper.serverError(req, res, err.message);
    }
  },

  getBerkas: async (req, res) => {
    const fileName = req.params.path;
    try {
      const fileExtension = path.extname(fileName);
      const filePath = path.resolve(__dirname, "../..", fileName);
      const fileBuffer = fs.readFileSync(filePath);

      res.writeHead(200, {
        "Content-Type": `image/${fileExtension.substr(1)}`,
      });
      res.end(fileBuffer);
      logger.loggerSucces(req, 200);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  deleteBerkas: async (req, res) => {
    try {
      const data = await Berkas.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        const filePath = path.resolve(__dirname, "../..", data.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          await data.destroy();
        }
        responseHelper.deleted(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  exportPersyaratan: async (req, res) => {
    // Buat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const data = await Penumpang.findAll({
      attributes: ["id", "santri_uuid"],
      where: {
        ...(req.query.jenis_kelamin && {
          "$santri.jenis_kelamin$": req.query.jenis_kelamin,
        }),
        ...(req.query.blok && {
          "$santri.id_blok$": req.query.blok,
        }),
        ...(req.query.wilayah && {
          "$santri.alias_wilayah$": req.query.wilayah,
        }),
      },
      include: [
        {
          model: Santri,
          as: "santri",
          attributes: { exclude: ["raw"] },
        },
        {
          model: Persyaratan,
          as: "persyaratan",
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    // Menambahkan header sesuai dengan parameter
    const header = [];
    header.push({ header: "No", key: "no" });
    header.push({ header: "NIUP", key: "niup" });
    header.push({ header: "Nama", key: "nama" });
    header.push({ header: "Jenis Kelamin", key: "jk" });
    header.push({ header: "Status Pembayaran", key: "status" });

    worksheet.columns = header;

    data.forEach((d, index) => {
      const row = {
        no: index + 1,
        niup: d?.santri?.niup,
        nama: d?.santri?.nama_lengkap,
        jk: d?.santri?.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
      };

      if (req.query.jenis === "bps") {
        row["status"] =
          d?.persyaratan?.lunas_bps === true ? "lunas" : "belum lunas";
      }

      if (req.query.jenis === "kosmara") {
        row["status"] =
          d?.persyaratan?.lunas_kosmara === true ? "lunas" : "belum lunas";
      }

      worksheet.addRow(row);
    });

    // Simpan file Excel ke dalam buffer
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        // Set header HTTP untuk melakukan download file
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="template.xlsx"'
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

  importPersyaratan: async (req, res) => {
    const excelBuffer = req.file.buffer;

    const workbook = new ExcelJS.Workbook();
    workbook.xlsx
      .load(excelBuffer)
      .then(() => {
        let worksheet;
        worksheet = workbook.getWorksheet("Sheet 1");
        const data = [];

        // Loop melalui baris 2 ke atas dan ambil kolom B dan E
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber >= 2) {
            // baca excel KOSMARA
            const columnAValue = row.getCell("A").value;
            const columnCValue = row.getCell("C").value;
            // baca excel BPS
            const columnBValue = row.getCell("B").value;
            const columnEValue = row.getCell("E").value;

            if (req.query.jenis === "bps") {
              // Pastikan nilai tidak kosong sebelum menambahkannya ke array
              if (columnBValue !== null && columnEValue !== null) {
                data.push({ niup: columnBValue, status: columnEValue });
              }
            } else if (req.query.jenis === "kosmara") {
              // Pastikan nilai tidak kosong sebelum menambahkannya ke array
              if (columnAValue !== null && columnCValue !== null) {
                data.push({ niup: columnAValue, status: columnCValue });
              }
            }
          }
        });
        const promises = data.map(async (d) => {
          try {
            const santri = await Santri.findOne({
              attributes: ["uuid"],
              where: {
                niup: d.niup,
              },
              include: {
                model: Penumpang,
                as: "penumpang",
                attributes: ["id"],
              },
            });
            const persyaratan = await Persyaratan.findOne({
              where: {
                penumpang_id: santri?.penumpang?.id,
              },
            });
            if (persyaratan) {
              if (req.query.jenis === "bps") {
                persyaratan.lunas_bps = d.status === "lunas" ? true : false;
              } else if (req.query.jenis === "kosmara") {
                persyaratan.lunas_kosmara = d.status <= 0 ? true : false;
              }
              await persyaratan.save();
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
};
