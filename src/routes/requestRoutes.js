const { Router } = require("express");
const { createRequest } = require("../controllers/requestController");

const requestRouter = Router();
requestRouter.post("/createRequest", createRequest);

module.exports = requestRouter;
