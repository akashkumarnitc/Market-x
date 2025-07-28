// import modules
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

// import routes
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import requestRoutes from "./routes/request.routes.js";

// configure
dotenv.config();
const app = express();

// middlewares
app.use(express.json()); // parse json body
app.use(express.urlencoded({ extended: true })); // parse url-encoded data

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());

// connect DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/request", requestRoutes);

// falback route
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found", success: false });
});

// start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
