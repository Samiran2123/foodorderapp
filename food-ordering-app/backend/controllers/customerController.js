const pool = require("../config/db");

/* ==================================
   Get All Approved Restaurants
================================== */

const getRestaurants = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                id,
                restaurant_name,
                description,
                address,
                phone,
                image
             FROM restaurants
             WHERE status='Approved'
             ORDER BY restaurant_name`
        );

        res.json({
            success: true,
            restaurants: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

/* ==================================
   Get Foods of One Restaurant
================================== */

const getRestaurantFoods = async (req, res) => {

    try {

        const restaurantId = req.params.id;

        const result = await pool.query(
            `SELECT *
             FROM foods
             WHERE restaurant_id=$1
             ORDER BY id DESC`,
            [restaurantId]
        );

        res.json({
            success: true,
            foods: result.rows
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
    getRestaurants,
    getRestaurantFoods
};