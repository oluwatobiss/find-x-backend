const { Router } = require("express");
const controller = require("../controllers/leader");
const router = Router();

router.get("/", controller.getLeaders);
router.post("/", controller.createLeader);

module.exports = router;
