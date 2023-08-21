const logger = require("./logger");

module.exports = {
  // response untuk get semua data setup
  // allDataSetup: (req, res, data) => {
  //   res.status(200).json({
  //     code: 200,
  //     message: "Setup Berhasil",
  //     data: data,
  //   });
  // },

  syncSuccess: (req, res) => {
    logger.loggerSucces(req, 200);
    res.status(201).json({
      code: 201,
      message: "Sinkronasi dengan PEDATREN berhasil",
    });
  },

  allData: (req, res, page, limit, data, filter = []) => {
    logger.loggerSucces(req, 200);
    res
      .status(200)
      .set({
        x_total_data: data.count,
        x_page_limit: limit,
        x_total_page: Math.ceil(data.count / limit),
        x_current_page: page,
      })
      .json({
        code: 200,
        message: "Berhasil mendapatkan semua data",
        data: data.rows,
        filter: filter,
      });
  },

  // allDataWithPedatren: (req, res, page, limit, data) => {
  //   res
  //     .status(200)
  //     .set({
  //       x_total_data: data.headers["x-data-total"],
  //       x_page_limit: limit,
  //       x_total_page: data.headers["x-pagination-total-page"],
  //       x_current_page: page,
  //     })
  //     .json({
  //       code: 200,
  //       message: "Berhasil mendapatkan semua data",
  //       data: data.data,
  //     });
  // },

  //   response untuk get satu data
  oneData: (req, res, data) => {
    logger.loggerSucces(req, 200);
    res.status(200).json({
      code: 200,
      message: "Berhasil mendapatkan detail data",
      data: data,
    });
  },

  //   response untuk get satu data dengan data dari pedatren
  // oneDataWithPedatren: (req, res, data, santri) => {
  //   res.status(200).json({
  //     code: 200,
  //     message: "Berhasil mendapatkan detail data",
  //     data: data,
  //     santri: santri,
  //   });
  // },

  //   response untuk get satu data dengan data dari pedatren
  auth: (req, res, token, data, santri) => {
    res.status(200).json({
      code: 200,
      message: "Berhasil login",
      token: token,
      data: data,
    });
  },

  //   response untuk get image dari pedatren
  imageWithPedatren: (req, res, data) => {
    res.contentType("image/jpeg").send(Buffer.from(data, "binary"));
  },

  //   response untuk data not found
  notFound: (req, res) => {
    logger.loggerError(req, 404, "Not Found", "Data tidak ditemukan");
    res.status(404).json({
      code: 404,
      message: "Not Found",
      error: "Data tidak ditemukan",
    });
  },

  //   response untuk mengubah atau mengubah data
  createdOrUpdated: (req, res) => {
    logger.loggerAdUp(req);
    res.status(201).json({
      code: 201,
      message: "Berhasil menambahkan atau mengubah data",
    });
  },

  //   response untuk data bad request
  badRequest: (req, res, error) => {
    logger.loggerError(req, 400, "Bad Request", error);
    res.status(400).json({
      code: 400,
      message: "Bad Request",
      error: error,
    });
  },

  //   response untuk menghapus data
  deleted: (req, res) => {
    logger.loggerSucces(req, 204);
    res.status(204).json({
      code: 204,
      message: "Berhasil menghapus data",
    });
  },

  //  response untuk not authorize
  unauthorized: (req, res) => {
    logger.loggerError(req, 401, "Unauthorized", "Username / Password Salah");
    res.status(401).json({
      code: 401,
      message: "Unauthorized",
      error: "Username / Password Salah",
    });
  },

  //  response untuk not authorize
  forbidden: (req, res) => {
    logger.loggerError(req, 403, "Forbidden", "Anda tidak memiliki akses");
    res.status(403).json({
      code: 403,
      message: "Forbidden",
      error: "Anda tidak memiliki akses",
    });
  },

  //   response untuk internal server error
  serverError: (req, res, error) => {
    logger.loggerError(req, 500, "Terjadi kesalahan pada server", error);
    res.status(500).json({
      code: 500,
      message: "Terjadi kesalahan pada server",
      error: error,
    });
  },
};
