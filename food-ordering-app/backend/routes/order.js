const authenticateUser = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/", authenticateUser, async (req, res) => {
    try {

        const { items } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty."
            });
        }

        let total = 0;
        let restaurantId = null;

        // Validate every food item
        for (const item of items) {

            const foodResult = await pool.query(
                `SELECT id, price, restaurant_id
                 FROM foods
                 WHERE id = $1`,
                [item.id]
            );

            if (foodResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Food with ID ${item.id} not found`
                });
            }

            const food = foodResult.rows[0];

            // Save restaurant id from first item
            if (!restaurantId) {
                restaurantId = food.restaurant_id;
            }

            // Ensure all items belong to same restaurant
            if (restaurantId !== food.restaurant_id) {
                return res.status(400).json({
                    success: false,
                    message: "You can only order from one restaurant at a time."
                });
            }

            // Calculate total from database price
            total += Number(food.price) * item.quantity;
        }

        // Create order
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, restaurant_id, total)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [userId, restaurantId, total]
        );

        const orderId = orderResult.rows[0].id;

        // Insert order items
        for (const item of items) {

            const foodResult = await pool.query(
                `SELECT price
                 FROM foods
                 WHERE id = $1`,
                [item.id]
            );

            const food = foodResult.rows[0];

            await pool.query(
                `INSERT INTO order_items
                (order_id, food_id, quantity, price)
                VALUES ($1, $2, $3, $4)`,
                [
                    orderId,
                    item.id,
                    item.quantity,
                    food.price
                ]
            );
        }

        res.json({
            success: true,
            message: "Order Placed Successfully",
            orderId,
            restaurantId,
            total
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
});

module.exports = router;