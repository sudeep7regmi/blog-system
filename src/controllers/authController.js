const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerSchema, loginSchema } = require('../validation/authValidation')

const register = async (req, res) => {
    try {
      registerSchema.parse(req.body)
  
      const { name, email, password } = req.body
  
      const existing = await prisma.user.findUnique({
        where: { email }
      })
  
      if (existing) {
        return res.status(400).json({ message: "User exists" })
      }
  
      const hashed = await bcrypt.hash(password, 10)
  
      const user = await prisma.user.create({
        data: { name, email, password: hashed }
      })
  
      res.json(user)
  
    } catch (err) {
      return res.status(400).json({
        error: err.errors || err.message
      })
    }
  }

const login = async (req, res) => {
  try {
    loginSchema.parse(req.body)

    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",  
      secure: false 
    })

    res.json({ message: "Login successful" })

  } catch (err) {
    return res.status(400).json({
      error: err.errors || err.message
    })
  }
}

const me = (req, res) => {
  res.json({ userId: req.user.id })
}

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax"
  })

  res.json({ message: "Logged out successfully" })
}

module.exports = {
  register,
  login,
  logout,
  me  
}