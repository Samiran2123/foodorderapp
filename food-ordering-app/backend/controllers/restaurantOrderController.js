const pool = require("../config/db");

const getRestaurantOrders = async (req, res) => {
    try {

        const restaurantId = req.restaurant.id;

        const result = await pool.query(
            `SELECT
                o.id AS order_id,
                u.name AS customer_name,
                u.email,
                o.total,
                o.status,
                o.ordered_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.restaurant_id = $1
            ORDER BY o.ordered_at DESC`,
            [restaurantId]
        );

        res.json({
            success: true,
            orders: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const restaurantId = req.restaurant.id;
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "Pending",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        const result = await pool.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2
               AND restaurant_id = $3
             RETURNING *`,
            [status, id, restaurantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully.",
            order: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    getRestaurantOrders,
    updateOrderStatus
};