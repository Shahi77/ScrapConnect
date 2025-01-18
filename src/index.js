require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { server, app } = require("./service/socketServer");
const v1Router = require("./routes/v1Routes");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/v1", v1Router);
const PORT = process.env.PORT || 5001;
const init = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize the server:", error);
    process.exit(1);
  }
};

init();
