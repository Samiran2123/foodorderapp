import pool from "../config/db.js";

// Apply for Restaurant
export const applyRestaurant = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const {
            restaurant_name,
            description,
            address,
            phone,
            image
        } = req.body;

        // Check if user already applied
        const existing = await pool.query(
            "SELECT * FROM restaurants WHERE owner_id=$1",
            [ownerId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted a restaurant application."
            });
        }

        const result = await pool.query(
            `INSERT INTO restaurants
            (owner_id, restaurant_name, description, address, phone, image)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                ownerId,
                restaurant_name,
                description,
                address,
                phone,
                image
            ]
        );

        res.status(201).json({
            success: true,
            message: "Restaurant application submitted successfully.",
            restaurant: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};