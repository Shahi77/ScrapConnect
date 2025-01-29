const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createRequest = async (req, res) => {
  const { scrapDetails, pickupType, lat, lng } = req.body;
  try {
    //1. Only seller can create request
    if (req.user.type !== "Seller") {
      return res
        .status(403)
        .json({ error: "Only sellers can create pickup requests" });
    }

    //2.Create new request
    const newRequest = await prisma.request.create({
      data: {
        sellerId: req.user.userId,
        scrapDetails,
        pickupType,
        lat,
        lng,
      },
    });

    // TODO1: Notify nearby buyers

    // TODO2: Publish to Kafka

    res.status(201).json({
      message: "Pickup request created successfully",
      request: newRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create request", details: error.message });
  }
};

module.exports = { createRequest };
