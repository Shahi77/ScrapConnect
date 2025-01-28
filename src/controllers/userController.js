const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const signup = async (req, res) => {
  const { type, name, email, password } = req.body;
  try {
    //1.Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    //2.Hash user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    //3.Create new user
    const user = await prisma.user.create({
      data: {
        type,
        name,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

module.exports = { signup, login, logout };
