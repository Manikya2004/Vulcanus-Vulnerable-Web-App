CREATE DATABASE IF NOT EXISTS vulnerable_app;
USE vulnerable_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT
);

-- Insert a default admin user for testing
INSERT INTO users (username, password, bio) VALUES ('admin', 'supersecretpassword', 'I am the admin.');
