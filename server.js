require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for development (enable and configure for production)
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// API Routes (must come before static files)
app.use("/api/auth", authRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for all non-API routes (for client-side routing)
// Using a function route handler to avoid Express 5 wildcard issues
app.use((req, res, next) => {
  // Skip API routes - let them pass through to 404 if not found
  if (req.path.startsWith("/api")) {
    return next();
  }
  // For all other routes, serve index.html for SPA routing
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      next(err);
    }
  });
});

// Start server
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
