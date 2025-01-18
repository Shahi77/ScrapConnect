const { Router } = require("express");
const requestRouter = require("./requestRoutes");

const v1Router = Router();

v1Router.use("/api", requestRouter);

module.exports = v1Router;
