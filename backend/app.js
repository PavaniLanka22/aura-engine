const express = require("express");
const cors = require("cors");

const inventoryRoutes = require("./routes/inventoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();


/*
 * ================================
 * CORS
 * ================================
 *
 * CLIENT_URL is provided through
 * environment variables.
 *
 * Local:
 * http://localhost:5173
 *
 * Production:
 * https://your-frontend.vercel.app
 */

const allowedOrigins = (
    process.env.CLIENT_URL || ""
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {

            /*
             * Allow requests without an origin.
             * Useful for Postman/server-to-server requests.
             */

            if (!origin) {
                return callback(null, true);
            }

            /*
             * Allow configured frontend origins.
             */

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(
                    "CORS policy: Origin not allowed."
                )
            );
        }
    })
);

app.use(express.json());


/*
 * ================================
 * HEALTH CHECK
 * ================================
 */

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "Aura Engine API is running."
    });
});


/*
 * ================================
 * INVENTORY ROUTES
 * ================================
 */

app.use(
    "/api/inventory",
    inventoryRoutes
);


/*
 * ================================
 * ANALYTICS ROUTES
 * ================================
 */

app.use(
    "/api/analytics",
    analyticsRoutes
);


/*
 * ================================
 * 404 HANDLER
 * ================================
 */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});


/*
 * ================================
 * GLOBAL ERROR HANDLER
 * ================================
 */

app.use(
    (error, req, res, next) => {

        console.error(
            "Unhandled server error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Internal server error."
        });
    }
);


module.exports = app;