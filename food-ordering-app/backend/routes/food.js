const express = require("express");
const router = express.Router();
const pool = require("../config/db");
// Get all foods
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM foods ORDER BY id"
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;