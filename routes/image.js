const { Router } = require("express");
const controller = require("../controllers/image");

const router = Router();

router.get("/", controller.getImages);
router.post("/", controller.createImage);
router.put("/:id", controller.updateImage);

module.exports = router;
