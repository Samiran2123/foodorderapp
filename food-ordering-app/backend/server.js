const express = require("express");
const cors = require("cors");
require("dotenv").config();

const foodRoutes = require("./routes/food");
const orderRoutes = require("./routes/order");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("Food Ordering API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});