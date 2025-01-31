const { PrismaClient } = require("@prisma/client");
const { connectedUsers, io } = require("../service/socketServer");
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
        sellerId: req.user.id,
        scrapDetails,
        pickupType,
        lat,
        lng,
      },
    });

    // 3. Notify vendors within 5km radius
    notifyVendors({
      lat,
      lng,
      scrapDetails,
      pickupType,
      sellerId: req.user.id,
    });

    res.status(201).json({
      message: "Pickup request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res
      .status(500)
      .json({ error: "Failed to create request", details: error.message });
  }
};

//Notify nearby vendors within 5Km radius
const notifyVendors = (requestData) => {
  const { lat, lng, scrapDetails, pickupType, sellerId } = requestData;

  connectedUsers.forEach((user, socketId) => {
    if (user.userType === "buyer") {
      const distance = calculateDistance(lat, lng, user.lat, user.lng);
      if (distance <= 5) {
        io.to(socketId).emit("newPickupRequest", {
          scrapDetails,
          pickupType,
          sellerId,
          lat,
          lng,
        });
        console.log(`Notified vendor ${user.userId} (${socketId}) within 5km`);
      }
    }
  });
};
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

module.exports = { createRequest };
