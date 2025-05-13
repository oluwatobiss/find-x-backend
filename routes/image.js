const { Router } = require("express");
const controller = require("../controllers/image");
const middleware = require("../middlewares/authentication");
const router = Router();

router.get("/", controller.getImages);
router.get("/:id", controller.getImageItems);
router.post("/", middleware.authenticateUser, controller.createImage);
router.put("/:id", middleware.authenticateUser, controller.updateImage);
router.delete("/:id", middleware.authenticateUser, controller.deleteImage);

module.exports = router;
