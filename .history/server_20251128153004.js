const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authRoutes');

// Auth Routes
app.use("/api/auth",  authRoutes);

app.listen(5000, () => console.log("Server running on 5000"));
