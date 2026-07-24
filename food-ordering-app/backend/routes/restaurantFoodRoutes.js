const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRestaurant = require("../middleware/restaurantMiddleware");

const {
    addFood,
    getMyFoods,
    updateFood,
    deleteFood
} = require("../controllers/restaurantFoodController");

// Add Food
router.post(
    "/foods",
    authenticateUser,
    authorizeRestaurant,
    addFood
);

// View My Foods
router.get(
    "/foods",
    authenticateUser,
    authorizeRestaurant,
    getMyFoods
);

// Update Food
router.put(
    "/foods/:id",
    authenticateUser,
    authorizeRestaurant,
    updateFood
);

// Delete Food
router.delete(
    "/foods/:id",
    authenticateUser,
    authorizeRestaurant,
    deleteFood
);

module.exports = router;