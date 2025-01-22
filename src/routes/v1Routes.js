const { Router } = require("express");
const requestRouter = require("./requestRoutes");
const userRouter = require("./userRoutes");

const v1Router = Router();

v1Router.use("/api", requestRouter);
v1Router.use("/api", userRouter);

module.exports = v1Router;
