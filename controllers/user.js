const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const createUser = async (req, res, next) => {
  console.log("=== createUser controller ===");
  console.log(req.body);
  const { firstName, lastName, username, email, password, admin, adminCode } =
    req.body;
  let status = "GAMER";
  if (admin) {
    if (adminCode === process.env.ADMIN_CODE) {
      status = "ADMIN";
    } else {
      return next(new Error("Incorrect admin code provided"));
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
};

module.exports = { createUser };
