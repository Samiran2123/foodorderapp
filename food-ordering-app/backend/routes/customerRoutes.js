const express = require("express");

const router = express.Router();

const {
    getRestaurants,
    getRestaurantFoods
} = require("../controllers/customerController");

router.get("/restaurants", getRestaurants);

router.get(
    "/restaurants/:id/foods",
    getRestaurantFoods
);

module.exports = router;