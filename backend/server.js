import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper to auto-create database and tables
async function initDatabase() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "parcelops";

  try {
    // 1. Connect without selecting database to ensure database exists
    const rootConnection = await mysql.createConnection({ host, user, password });
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConnection.end();

    // 2. Connect with pool and create tables if they do not exist
    const connection = await db.getConnection();
    console.log(`✅ Connected to MySQL database: ${database}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id            VARCHAR(36)  NOT NULL PRIMARY KEY,
        full_name     VARCHAR(255) NOT NULL,
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role          ENUM('customer', 'worker', 'admin') NOT NULL DEFAULT 'customer',
        created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id         VARCHAR(36)  NOT NULL PRIMARY KEY,
        email      VARCHAR(255) NOT NULL,
        otp_code   VARCHAR(10)  NOT NULL,
        expires_at DATETIME     NOT NULL,
        created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_otp_email (email)
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id                   VARCHAR(36) NOT NULL PRIMARY KEY,
        shipment_ref         VARCHAR(255),
        tracking_number      VARCHAR(255),
        sender_name          VARCHAR(255),
        sender_phone         VARCHAR(255),
        sender_email         VARCHAR(255),
        sender_address       TEXT,
        receiver_name        VARCHAR(255),
        receiver_phone       VARCHAR(255),
        receiver_email       VARCHAR(255),
        receiver_address     TEXT,
        parcel_type          VARCHAR(255),
        description          TEXT,
        weight               VARCHAR(50),
        estimated_value      DECIMAL(10,2),
        special_instructions TEXT,
        pickup_branch        VARCHAR(255),
        delivery_method      VARCHAR(255),
        delivery_speed       VARCHAR(255),
        delivery_fee         DECIMAL(10,2),
        taxes                DECIMAL(10,2),
        total                DECIMAL(10,2),
        created_at           DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    console.log("✅ All database tables verified/created successfully.");
    connection.release();
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

// MySQL Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "parcelops",
  waitForConnections: true,
  connectionLimit: 10,
});

initDatabase();

/*
|--------------------------------------------------------------------------
| SIGNUP
|--------------------------------------------------------------------------
*/
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { full_name, email, password, confirm_password } = req.body;

    // Validation
    if (!full_name || !email || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user exists
    const [existingUser] = await db.query(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate UUID
    const userId = uuidv4();

    // Insert user
    await db.query(
      `INSERT INTO user (id, full_name, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [userId, full_name, email, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        full_name,
        email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ParcelOps API Running",
  });
});







app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await db.query(
      `INSERT INTO otp_codes
       (id, email, otp_code, expires_at)
       VALUES (?, ?, ?, ?)`,
      [uuidv4(), email, otp, expiresAt]
    );

    res.json({
      success: true,
      message: "OTP generated",
      otp, // REMOVE THIS LATER IN PRODUCTION
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
    });
  }
});




app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await db.query(
      `SELECT *
       FROM otp_codes
       WHERE email = ?
       AND otp_code = ?
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await db.query(
      "DELETE FROM otp_codes WHERE email = ?",
      [email]
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
/*










|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/











/*
|--------------------------------------------------------------------------
| CREATE SHIPMENT
|--------------------------------------------------------------------------
*/
app.post("/api/shipments", async (req, res) => {
  try {
    const {
      sender,
      receiver,
      parcel,
      options,
      costs,
    } = req.body;

    // Validation
    if (
      !sender.fullName ||
      !sender.phone ||
      !sender.email ||
      !sender.address ||
      !receiver.fullName ||
      !receiver.phone ||
      !receiver.email ||
      !receiver.address ||
      !parcel.type ||
      !parcel.description ||
      !parcel.estimatedValue ||
      !options.pickupBranch
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    const shipmentId = uuidv4();

    const shipmentRef =
      "SPX" + Date.now();

    const trackingNumber =
      "TRK" +
      Math.floor(
        100000000 + Math.random() * 900000000
      );

    await db.query(
      `
      INSERT INTO shipments (
        id,
        shipment_ref,
        tracking_number,

        sender_name,
        sender_phone,
        sender_email,
        sender_address,

        receiver_name,
        receiver_phone,
        receiver_email,
        receiver_address,

        parcel_type,
        description,
        weight,
        estimated_value,
        special_instructions,

        pickup_branch,
        delivery_method,
        delivery_speed,

        delivery_fee,
        taxes,
        total
      )

      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        shipmentId,
        shipmentRef,
        trackingNumber,

        sender.fullName,
        sender.phone,
        sender.email,
        sender.address,

        receiver.fullName,
        receiver.phone,
        receiver.email,
        receiver.address,

        parcel.type,
        parcel.description,
        parcel.weight || null,
        parcel.estimatedValue,
        parcel.instructions || null,

        options.pickupBranch,
        options.deliveryMethod,
        options.deliverySpeed,

        costs.deliveryFee,
        costs.taxes,
        costs.total,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      shipment: {
        id: shipmentId,
        shipmentRef,
        trackingNumber,
      },
    });
  } catch (error) {
    console.error("Shipment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
    });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});