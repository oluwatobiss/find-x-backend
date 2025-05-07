const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const validate = require("../middlewares/validator");
const prisma = new PrismaClient();

async function getUsers(req, res) {
  try {
    console.log("=== getUsers ===");
    console.log(req.query);

    if (req.query.status !== "ADMIN") {
      return res.status(400).json({ message: "Invalid access credentials" });
    }

    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    return res.json(users);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

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

const updateUser = [
  validate.updateUserForm,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const id = +req.params.id;
      const { firstName, lastName, username, email, admin, adminCode } =
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
      const user = await prisma.user.update({
        where: { id },
        data: { firstName, lastName, username, email, status },
      });
      await prisma.$disconnect();
      return res.json(user);
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  },
];

async function deleteUser(req, res) {
  try {
    const id = +req.params.id;
    const user = await prisma.user.delete({ where: { id } });
    await prisma.$disconnect();
    return res.json(user);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser };
