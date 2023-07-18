module.exports = {
  // response untuk get semua data
  allData: (res, page, limit, data, filter = []) => {
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

  allDataWithPedatren: (res, page, limit, data) => {
    res
      .status(200)
      .set({
        x_total_data: data.headers["x-data-total"],
        x_page_limit: limit,
        x_total_page: data.headers["x-pagination-total-page"],
        x_current_page: page,
      })
      .json({
        code: 200,
        message: "Berhasil mendapatkan data santri",
        data: data.data,
      });
  },

  //   response untuk get satu data
  oneData: (res, data) => {
    res.status(200).json({
      code: 200,
      message: "Berhasil mendapatkan detail data",
      data: data,
    });
  },

  //   response untuk get satu data dengan data dari pedatren
  oneDataWithPedatren: (res, data, santri) => {
    res.status(200).json({
      code: 200,
      message: "Berhasil mendapatkan detail data",
      data: data,
      santri: santri,
    });
  },

  //   response untuk get satu data dengan data dari pedatren
  auth: (res, token, data, santri) => {
    res.status(200).json({
      code: 200,
      message: "Authorized",
      token: token,
      data: data,
      santri: santri,
    });
  },

  //   response untuk get satu data dengan data dari pedatren
  imageWithPedatren: (res, data) => {
    res.contentType("image/jpeg").send(Buffer.from(data, "binary"));
  },

  //   response untuk data not found
  notFound: (res) => {
    res.status(404).json({
      code: 404,
      message: "Not Found",
      error: "Data Tidak ditemukan",
    });
  },

  //   response untuk mengubah atau mengubah data
  createdOrUpdated: (res) => {
    res.status(201).json({
      code: 201,
      message: "Berhasil menambahkan atau mengubah data",
    });
  },

  //   response untuk data bad request
  badRequest: (res, error) => {
    res.status(400).json({
      code: 400,
      message: "Bad Request",
      error: error,
    });
  },

  //   response untuk menghapus data
  deleted: (res) => {
    res.status(200).json({
      code: 200,
      message: "Berhasil menghapus data",
    });
  },

  //  response untuk not authorize
  unauthorized: (res) => {
    res.status(401).json({
      code: 401,
      message: "Unauthorized",
      error: "invalid credentials",
    });
  },

  //  response untuk not authorize
  forbidden: (res) => {
    res.status(403).json({
      code: 403,
      message: "Forbidden",
      error: "anda tidak memiliki akses",
    });
  },

  //   response untuk internal server error
  serverError: (res, error) => {
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: error,
    });
  },
};
