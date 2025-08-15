const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();
require("./utils/cronjob");

const app = express();
const server = http.createServer(app);

// ✅ Dynamic Allowed Origins
const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,     // any localhost port
  /^https:\/\/.*\.vercel\.app$/   // any Vercel subdomain
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow requests with no origin (Postman, curl)

      const isAllowed = allowedOrigins.some((pattern) =>
        typeof pattern === "string" ? pattern === origin : pattern.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ✅ Body & Cookie Parsing
app.use(express.json());
app.use(cookieParser());

// ✅ Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

// ✅ Use Routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

// ✅ Socket Initialization
const initializeSocket = require("./utils/socket");
initializeSocket(server);

// ✅ Start Database & Server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    const PORT = process.env.PORT || 7777;
    server.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
