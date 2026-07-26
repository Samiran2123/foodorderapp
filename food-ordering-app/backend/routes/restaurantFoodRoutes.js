const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRestaurant = require("../middleware/restaurantMiddleware");
const {
    getRestaurantOrders,
    updateOrderStatus
} = require("../controllers/restaurantOrderController");

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

router.get(
    "/orders",
    authenticateUser,
    authorizeRestaurant,
    getRestaurantOrders
);

router.put(
    "/orders/:id/status",
    authenticateUser,
    authorizeRestaurant,
    updateOrderStatus
);

module.exports = router;