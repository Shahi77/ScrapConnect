const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //1. Check if user with email is registered or not
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found, First register yourself" });
    }

    //2.Compare user's password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //3.Signing JSON Web token for each user
    const token = jwt.sign(
      { userId: user.id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

module.exports = { signup, login, logout };
