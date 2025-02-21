/**
 * db.js
 * @description :: exports database connection using mongoose
 */

const mongoose = require("mongoose");

const uri =
  process.env.NODE_ENV === "test"
    ? process.env.DB_TEST_URL
    : process.env.DB_URL;
mongoose
  .connect("mongodb://localhost:27017/g_drive", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {});
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to mongodb");
});

db.on("error", (e) => {
  console.log("Error in mongodb connection -", e?.message);
});

module.exports = mongoose;
