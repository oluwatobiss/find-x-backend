const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const validate = require("../middlewares/validator");
const prisma = new PrismaClient();

const createUser = [
  validate.signUpForm,
  async (req, res, next) => {
    console.log("=== createUser controller ===");
    console.log(req.body);
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log("=== createUser controller error ===");
      console.log(result.array());
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, username, email, password, admin, adminCode } =
      req.body;
    let status = "GAMER";
    if (admin) {
      if (adminCode === process.env.ADMIN_CODE) {
        status = "ADMIN";
      } else {
        return next(
          Error("Incorrect admin code provided", {
            cause: { msg: "Incorrect code", path: "adminCode" },
          })
        );
      }
    }
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      try {
        const user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            status,
          },
        });
        await prisma.$disconnect();
        return res.json({ id: user.id, username });
      } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      }
    });
  },
];

module.exports = { createUser };
