const { PrismaClient } = require("../prisma/generated/prisma-client-js/client");
const { validationResult } = require("express-validator");
const validate = require("../middlewares/validator");
const prisma = new PrismaClient();

async function getImages(req, res) {
  try {
    const images =
      req.query.auth === "true"
        ? await prisma.image.findMany()
        : await prisma.image.findMany({ where: { sample: true } });
    await prisma.$disconnect();
    return res.json(images);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function getImageItems(req, res) {
  try {
    const id = +req.params.id;
    const image = await prisma.image.findUnique({ where: { id } });
    await prisma.$disconnect();
    return res.json(image.itemsData);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

const createImage = [
  validate.imageForm,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });
    try {
      const { imageName, imageUrl, sample, itemsData, published } = req.body;
      const response = await prisma.image.create({
        data: { imageName, imageUrl, sample, itemsData, published },
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
    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });
    try {
      const id = +req.params.id;
      const { imageName, imageUrl, sample, itemsData, published } = req.body;
      const image = await prisma.image.update({
        where: { id },
        data: { imageName, imageUrl, sample, itemsData, published },
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

async function deleteImage(req, res) {
  try {
    const id = +req.params.id;
    const image = await prisma.image.delete({ where: { id } });
    await prisma.$disconnect();
    return res.json(image);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

module.exports = {
  getImages,
  getImageItems,
  createImage,
  updateImage,
  deleteImage,
};
