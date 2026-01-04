-- ===============================
-- 1. DATABASE
-- ===============================
DROP DATABASE IF EXISTS travelgo;
CREATE DATABASE travelgo;
USE travelgo;

-- ===============================
-- 2. USERS (USER / ADMIN)
-- ===============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 3. DESTINATIONS
-- ===============================
CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 4. TRIPS
-- ===============================
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    available_seats INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
        ON DELETE CASCADE
);

-- ===============================
-- 5. BOOKINGS
-- ===============================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id)
        ON DELETE CASCADE
);

-- ===============================
-- 6. PAYMENTS
-- ===============================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('CARD', 'PAYPAL', 'CASH') NOT NULL,
    status ENUM('PAID', 'UNPAID') DEFAULT 'UNPAID',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE
);

-- ===============================
-- 7. REVIEWS
-- ===============================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- ===============================
-- 8. DEFAULT USERS (ADMIN + USER)
-- Password = 123456 (hashed example)
-- ===============================
INSERT INTO users (full_name, email, password, phone, role)
VALUES
('Admin TravelGo', 'admin@travelgo.com', '$2b$10$abcdefghijklmnopqrstuv', '0600000000', 'ADMIN'),
('User TravelGo', 'user@travelgo.com', '$2b$10$abcdefghijklmnopqrstuv', '0611111111', 'USER');

-- ===============================
-- 9. SAMPLE DATA
-- ===============================
INSERT INTO destinations (name, country, description, image_url)
VALUES ('Marrakech', 'Morocco', 'Touristic city with culture and history', 'https://example.com/marrakech.jpg');

INSERT INTO trips (destination_id, title, price, start_date, end_date, available_seats)
VALUES (1, 'Discover Marrakech', 299.99, '2026-03-01', '2026-03-07', 25);
