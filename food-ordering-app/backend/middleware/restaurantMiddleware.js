const pool = require("../config/db");

const authorizeRestaurant = async (req, res, next) => {
    try {

        // Check if the logged-in user is a restaurant owner
        if (req.user.role !== "restaurant") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Restaurant account required."
            });
        }

        // Find the restaurant owned by this user
        const result = await pool.query(
            `SELECT * FROM restaurants
             WHERE owner_id = $1`,
            [req.user.id]
        );

        // No restaurant found
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
        }

        const restaurant = result.rows[0];

        // Restaurant exists but is not approved
        if (restaurant.status !== "Approved") {
            return res.status(403).json({
                success: false,
                message: "Restaurant is not approved by admin."
            });
        }

        // Save restaurant details for later use
        req.restaurant = restaurant;

        next();

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = authorizeRestaurant;