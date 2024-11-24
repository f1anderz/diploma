const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const fdb = require("./config/dbConnection");

const methodRoutes = require("./api/routes/method");
const substanceRoutes = require("./api/routes/substance");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/method", methodRoutes);
app.use("/substance", substanceRoutes);

app.use((err, res) => {
  res.status(err.status || 500).json({
    error: {
      status: false,
      message: err.message,
    },
  });
});

process.on("SIGINT", async () => {
  await fdb.close();
  process.exit(0);
});

module.exports = app;
