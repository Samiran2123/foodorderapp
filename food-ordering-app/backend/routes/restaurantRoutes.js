const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const {
    applyRestaurant
} = require("../controllers/restaurantController");

router.post("/apply", authenticateUser, applyRestaurant);

module.exports = router;