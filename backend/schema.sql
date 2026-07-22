-- PaceLops Database Schema
-- Run this in phpMyAdmin or via MySQL CLI to set up the parcelops database

CREATE DATABASE IF NOT EXISTS parcelops CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE parcelops;

-- USERS
CREATE TABLE IF NOT EXISTS user (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer', 'worker', 'admin') NOT NULL DEFAULT 'customer',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- OTP CODES
CREATE TABLE IF NOT EXISTS otp_codes (
  id         VARCHAR(36)  NOT NULL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL,
  otp_code   VARCHAR(10)  NOT NULL,
  expires_at DATETIME     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_email (email)
) ENGINE=InnoDB;
