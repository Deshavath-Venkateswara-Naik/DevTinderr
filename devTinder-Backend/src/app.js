const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();
require("./utils/cronjob");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: true, // your frontend port
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment"); // Razorpay route
const chatRouter = require("./routes/chat");

// Route usage
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

// Socket
const initializeSocket = require("./utils/socket");
initializeSocket(server);

// DB & Server Start
connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT || 7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
