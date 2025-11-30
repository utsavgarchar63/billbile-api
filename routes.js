const express = require("express")
const adminRoutes = require("./routes/adminRoutes")
const app = express();

app.get("/", (req, res) => {
     res.send("💸 Welcome to billbite 💸")
})

app.use("/admin", adminRoutes)
module.exports = app     