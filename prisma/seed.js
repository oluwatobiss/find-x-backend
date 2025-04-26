const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  bcrypt.hash(process.env.ANONY_PASSWORD, 10, async (err, hashedPassword) => {
    if (err) return next(err);
    try {
      await prisma.user.create({
        data: {
          firstName: "Anony",
          lastName: "Anony",
          username: "anonymous",
          email: process.env.ANONY_EMAIL,
          password: hashedPassword,
          status: "ANONY",
        },
      });
      await prisma.$disconnect();
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  });
}
main();
