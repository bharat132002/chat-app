const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const cartController = require('../controllers/cartController');
// const validateJwt = require("../middlewares/validateJwtToken");


router.post('/add',validateJwt, cartController.addToCart);
router.get('/get-cart-items',validateJwt, cartController.getCart);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.use("/api/auth", require(""));

app.listen(5000, () => console.log("Server running on 5000"));
