const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Auth Routes
app.use("/api/auth", require("./routes/auth"));

app.listen(5000, () => console.log("Server running on 5000"));
