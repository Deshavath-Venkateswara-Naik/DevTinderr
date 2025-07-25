const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(
  cors({
    origin: true, // Reflects the request origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/chat"));

// DB and Socket Initialization
connectDB().then(() => {
  initializeSocket(server);
  server.listen(process.env.PORT || 7777, () =>
    console.log("Server running on port", process.env.PORT || 7777)
  );
});
