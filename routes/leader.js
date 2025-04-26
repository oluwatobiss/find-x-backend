const { Router } = require("express");
const controller = require("../controllers/leader");
const router = Router();

router.post("/", controller.createLeader);
module.exports = router;
