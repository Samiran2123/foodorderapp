const pool = require("../config/db");

const getAllRestaurants = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.id,
                r.restaurant_name,
                r.description,
                r.address,
                r.phone,
                r.status,
                r.created_at,
                u.id AS owner_id,
                u.name AS owner_name,
                u.email
            FROM restaurants r
            JOIN users u
                ON r.owner_id = u.id
            ORDER BY r.created_at DESC
        `);

        res.json({
            success: true,
            restaurants: result.rows
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const approveRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "UPDATE restaurants SET status='Approved' WHERE id=$1",
            [id]
        );

        await pool.query(
            `UPDATE users
             SET role='restaurant'
             WHERE id = (
                 SELECT owner_id
                 FROM restaurants
                 WHERE id=$1
             )`,
            [id]
        );

        res.json({
            success: true,
            message: "Restaurant Approved"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const rejectRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "UPDATE restaurants SET status = 'Rejected' WHERE id = $1",
            [id]
        );

        res.json({
            success: true,
            message: "Restaurant Rejected Successfully"
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
    getAllRestaurants,
    approveRestaurant,
    rejectRestaurant
};