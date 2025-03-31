const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const validate = require("../middlewares/validator");
const prisma = new PrismaClient();

async function getImages(req, res) {
  try {
    const images = await prisma.image.findMany();
    await prisma.$disconnect();
    return res.json(images);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

const createImage = [
  validate.imageForm,
  async (req, res) => {
    console.log("=== createImage controller ===");
    console.log(req.body);
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const { imageName, imageUrl, itemsData } = req.body;
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

const updateImage = [
  validate.imageForm,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const id = +req.params.id;
      const { imageName, imageUrl, itemsData } = req.body;
      const image = await prisma.image.update({
        where: { id },
        data: { imageName, imageUrl, itemsData },
      });
      await prisma.$disconnect();
      return res.json(image);
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  },
];

module.exports = { getImages, createImage, updateImage };
