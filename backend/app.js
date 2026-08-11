const express = require("express");
const cors = require("cors");

const inventoryRoutes = require("./routes/inventoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

/*
 * =====================================================
 * CORS
 * =====================================================
 */

const allowedOrigins = (
    process.env.CLIENT_URL || ""
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {

        // Allow Postman / server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        // Exact origins from CLIENT_URL
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow Vercel deployment URLs for Aura Engine
        if (
            origin.endsWith(".vercel.app") &&
            origin.includes("aura-engine")
        ) {
            return callback(null, true);
        }

        console.log("CORS blocked origin:", origin);

        return callback(null, false);
    },

    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

/*
 * =====================================================
 * BODY PARSER
 * =====================================================
 */

app.use(express.json());

/*
 * =====================================================
 * HEALTH CHECK
 * =====================================================
 */

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Aura Engine API is running."
    });
});

/*
 * =====================================================
 * INVENTORY ROUTES
 * =====================================================
 */

app.use(
    "/api/inventory",
    inventoryRoutes
);

/*
 * =====================================================
 * ANALYTICS ROUTES
 * =====================================================
 */

app.use(
    "/api/analytics",
    analyticsRoutes
);

/*
 * =====================================================
 * 404 HANDLER
 * =====================================================
 */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

/*
 * =====================================================
 * GLOBAL ERROR HANDLER
 * =====================================================
 */

app.use(
    (error, req, res, next) => {

        console.error(
            "Unhandled server error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
);

module.exports = app;