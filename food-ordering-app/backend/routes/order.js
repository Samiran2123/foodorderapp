const authenticateUser = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/", authenticateUser, async (req,res)=>{
    try {

      const { items } = req.body;

const userId = req.user.id;

        let total = 0;

        for (let item of items) {
            total += item.price * item.quantity;
        }

       const orderResult = await pool.query(
    "INSERT INTO orders (user_id,total) VALUES ($1,$2) RETURNING id",
    [userId, total]
);
        const orderId = orderResult.rows[0].id;

        for (let item of items) {
            await pool.query(
    "INSERT INTO order_items(order_id,food_id,quantity,price) VALUES($1,$2,$3,$4)",
    [orderId, item.id, item.quantity, item.price]
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