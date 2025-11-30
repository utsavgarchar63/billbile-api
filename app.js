const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./logger/logger");
const morgan = require("morgan");
const routes = require("./routes");
const { createDefaultAdmin } = require("./services/createAdmin");

const app = express()

app.use("/uploads", express.static("uploads"));
require("dotenv").config();
app.use(morgan("dev"));
app.use(cors({
     origin: ["http://localhost:3000", "https://billbite-admin.vercel.app"],
     credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", routes);

mongoose.connect(process.env.MONGO_URI).then(async () => {
     app.listen(process.env.PORT, () => {
          logger.info(`Server serve with port number: ${process.env.PORT}`);
     })
     await createDefaultAdmin()
     logger.info("Successfull connected to Database");
}).catch((err) => {
     console.log(err);
     logger.error("Error", err.message);
});