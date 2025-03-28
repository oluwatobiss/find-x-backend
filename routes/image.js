const { Router } = require("express");
const controller = require("../controllers/image");

const router = Router();

router.post("/", controller.createImage);

module.exports = router;
