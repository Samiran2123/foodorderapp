const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

const {
    getAllRestaurants,
    approveRestaurant,
    rejectRestaurant
} = require("../controllers/adminController");

const pool = require("../config/db");

/* =====================================
   ADMIN - ADD FOOD
===================================== */
router.post("/foods", authenticateUser, authorizeAdmin, async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            category,
            image,
            restaurant_id
        } = req.body;

        const result = await pool.query(
            `INSERT INTO foods
            (name, description, price, category, image, restaurant_id)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [name, description, price, category, image, restaurant_id]
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
});

/* =====================================
   ADMIN - VIEW ALL RESTAURANTS
===================================== */
router.get(
    "/restaurants",
    authenticateUser,
    authorizeAdmin,
    getAllRestaurants
);

/* =====================================
   ADMIN - APPROVE RESTAURANT
===================================== */
router.put(
    "/restaurants/:id/approve",
    authenticateUser,
    authorizeAdmin,
    approveRestaurant
);

/* =====================================
   ADMIN - REJECT RESTAURANT
===================================== */
router.put(
    "/restaurants/:id/reject",
    authenticateUser,
    authorizeAdmin,
    rejectRestaurant
);

module.exports = router;











































// const express = require("express");
// const router = express.Router();

// const authenticateUser = require("../middleware/authMiddleware");
// const authorizeAdmin = require("../middleware/adminMiddleware");
// const pool = require("../config/db");

// // Add Food (Admin Only)
// router.post("/foods", authenticateUser, authorizeAdmin, async (req, res) => {
//     try {

//         const { name, description, price, category, image } = req.body;

//         const result = await pool.query(
//             `INSERT INTO foods(name, description, price, category, image)
//              VALUES($1,$2,$3,$4,$5)
//              RETURNING *`,
//             [name, description, price, category, image]
//         );

//         res.status(201).json({
//             success: true,
//             message: "Food Added Successfully",
//             food: result.rows[0]
//         });

//     } catch (err) {
//         console.error(err);

//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }
// });

// module.exports = router;