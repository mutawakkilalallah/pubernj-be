require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT;

const auth = require("./middleware/authentication");
const access = require("./middleware/authorization");
const lock = require("./middleware/lockdata");

const authRouter = require("./src/auth/router");

const dashboardRouter = require("./src/dashboard/router");
const areaRouter = require("./src/area/router");
const dropspotRouter = require("./src/dropspot/router");
const armadaRouter = require("./src/armada/router");
const santriRouter = require("./src/santri/router");
const penumpangRouter = require("./src/penumpang/router");
const keuanganRouter = require("./src/keuangan/router");
const statistikRouter = require("./src/statistik/router");
const suratJalanRouter = require("./src/surat-jalan/router");
const userRouter = require("./src/user/router");

const logRouter = require("./src/log/router");
const syncRouter = require("./src/sync/router");
const publicRouter = require("./src/public/router");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders: "x_total_data, x_page_limt, x_total_page, x_current_page, X-Auth-Key",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("N.J.O.Y :) 2023");
});

app.use("/", authRouter);
app.use("/dashboard", auth, dashboardRouter);
app.use("/area", auth, areaRouter);
app.use("/dropspot", dropspotRouter);
app.use("/armada", auth, armadaRouter);
app.use("/santri", auth, santriRouter);
app.use("/penumpang", auth, penumpangRouter);
app.use("/keuangan", auth, keuanganRouter);
app.use("/statistik", auth, statistikRouter);
app.use("/surat-jalan", auth, suratJalanRouter);
app.use("/user", auth, userRouter);

app.use("/log", auth, access.sysadmin, logRouter);
app.use("/sync", auth, access.sysadmin, syncRouter);
app.use("/cari-santri", publicRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
