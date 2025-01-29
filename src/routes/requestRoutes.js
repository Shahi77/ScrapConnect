const { Router } = require("express");
const { createRequest } = require("../controllers/requestController");
const { verifyToken } = require("../middlewares/authMiddleware");

const requestRouter = Router();
requestRouter.post("/createRequest", verifyToken, createRequest);

module.exports = requestRouter;
