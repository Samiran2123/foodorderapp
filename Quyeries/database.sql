CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT
);

INSERT INTO foods(name, price, image)
VALUES
('Pizza', 299, 'pizza.jpg'),
('Burger', 149, 'burger.jpg'),
('Pasta', 199, 'pasta.jpg'),
('French Fries', 99, 'fries.jpg'),
('Cold Coffee', 129, 'coffee.jpg');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    food_id INT REFERENCES foods(id),
    quantity INT DEFAULT 1
);




