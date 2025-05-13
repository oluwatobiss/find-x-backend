const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  bcrypt.hash(process.env.ANONY_PASSWORD, 10, async (err, hashedPassword) => {
    if (err) return next(err);
    try {
      await prisma.user.upsert({
        where: { email: process.env.ANONY_EMAIL },
        update: {}, // Make upsert() behave like Sequelize's findOrCreate() method. In other words, An empty update object means "If the record (user) already exists, do nothing. Otherwise, create it." This type of seeding is called "idempotent seeding." (refs: (1) https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records (2) https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate)
        create: {
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
