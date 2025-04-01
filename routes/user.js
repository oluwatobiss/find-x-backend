const { Router } = require("express");
const controller = require("../controllers/user");

const router = Router();

router.get("/", controller.getUsers);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);

module.exports = router;
