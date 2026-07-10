const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {

        const { customer_name, items } = req.body;

        let total = 0;

        for (let item of items) {
            total += item.price * item.quantity;
        }

        const orderResult = await pool.query(
            "INSERT INTO orders (customer_name,total) VALUES ($1,$2) RETURNING id",
            [customer_name, total]
        );

        const orderId = orderResult.rows[0].id;

        for (let item of items) {
            await pool.query(
                "INSERT INTO order_items(order_id,food_id,quantity) VALUES($1,$2,$3)",
                [orderId, item.id, item.quantity]
            );
        }

        res.json({
            success: true,
            message: "Order Placed Successfully",
            orderId,
            total
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;``