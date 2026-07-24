const pool = require("../config/db");

/* ===========================
   Add Food
=========================== */
const addFood = async (req, res) => {
    try {

        const restaurantId = req.restaurant.id;

        const {
            name,
            description,
            price,
            category,
            image
        } = req.body;

        const result = await pool.query(
            `INSERT INTO foods
            (restaurant_id, name, description, price, category, image)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                restaurantId,
                name,
                description,
                price,
                category,
                image
            ]
        );

        res.status(201).json({
            success: true,
            message: "Food Added Successfully",
            food: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

/* ===========================
   View My Foods
=========================== */
const getMyFoods = async (req, res) => {
    try {

        const restaurantId = req.restaurant.id;

        const result = await pool.query(
            "SELECT * FROM foods WHERE restaurant_id=$1 ORDER BY id DESC",
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

/* ===========================
   Update Food
=========================== */
const updateFood = async (req, res) => {
    try {

        const restaurantId = req.restaurant.id;
        const { id } = req.params;

        const {
            name,
            description,
            price,
            category,
            image
        } = req.body;

        const result = await pool.query(
            `UPDATE foods
             SET
                name=$1,
                description=$2,
                price=$3,
                category=$4,
                image=$5
             WHERE id=$6
             AND restaurant_id=$7
             RETURNING *`,
            [
                name,
                description,
                price,
                category,
                image,
                id,
                restaurantId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        res.json({
            success: true,
            message: "Food Updated Successfully",
            food: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

/* ===========================
   Delete Food
=========================== */
const deleteFood = async (req, res) => {
    try {

        const restaurantId = req.restaurant.id;
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM foods
             WHERE id=$1
             AND restaurant_id=$2
             RETURNING *`,
            [id, restaurantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        res.json({
            success: true,
            message: "Food Deleted Successfully"
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
    addFood,
    getMyFoods,
    updateFood,
    deleteFood
};