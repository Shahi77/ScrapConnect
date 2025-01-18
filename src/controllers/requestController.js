const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createRequest = async (req, res) => {
  try {
    const { sellerId, scrapDetails, pickupType, lat, lng } = req.body;

    const newRequest = await prisma.request.create({
      data: {
        sellerId,
        scrapDetails,
        pickupType,
        lat,
        lng,
      },
    });
    //TODO1:Notify nearby buyers

    //TODO2:Publish to kafka

    return res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createRequest };
