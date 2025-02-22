const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
require("./config/db");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const Setup = require("./utils/setup");

const app = express();

app.use(cors());

Setup.setUpFirebase();

const indexRouter = require("./routes/index");
app.use(require("./utils/response/responseHandler"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/sss", (req, res) => {
  res.json("sdds");
});

app.use("/", indexRouter);

app.use("*", (req, res, next) => res.send("404"));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
