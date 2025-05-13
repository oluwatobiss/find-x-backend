const { Router } = require("express");
const controller = require("../controllers/leader");
const middleware = require("../middlewares/authentication");
const router = Router();

router.get("/", middleware.authenticateUser, controller.getLeaders);
router.post("/", controller.createLeader);

module.exports = router;
