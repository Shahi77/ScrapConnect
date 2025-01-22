const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const createUser = async (req, res) => {
  try {
    const { type, name } = req.body;

    const user = await prisma.user.create({
      data: {
        type,
        name,
      },
    });
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createUser };
