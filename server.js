const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled EXCEPTION... SHUTTING DOWN");
});
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("db connected");
  });

const PORT = 8080;
const server = app.listen(process.env.PORT || PORT, () => {
  console.log("App running on port", PORT);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled REJECTTION... SHUTTING DOWN");
  server.close(() => {
    process.exit(1);
  });
});
