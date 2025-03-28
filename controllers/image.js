const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const validate = require("../middlewares/validator");
const prisma = new PrismaClient();

const createImage = [
  validate.imageForm,
  async (req, res) => {
    console.log("=== createImage controller ===");
    console.log(req.body);
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { imageName, imageUrl, itemsData } = req.body;
    try {
      const response = await prisma.image.create({
        data: { imageName, imageUrl, itemsData },
      });
      await prisma.$disconnect();
      return res.json(response);
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  },
];

module.exports = { createImage };
