const router = require("express").Router();
const user = require("./user");
const category = require("./category");
const brand = require("./brand");
const currency = require("./currency");
const product = require("./product");

router.use(user);
router.use(category);
router.use(brand);
router.use(currency);
router.use(product);

module.exports = router;