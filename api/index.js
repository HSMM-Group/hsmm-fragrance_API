const router = require("express").Router();
const user = require("./user");
const category = require("./category");

router.use(user);
router.use(category);

module.exports = router;