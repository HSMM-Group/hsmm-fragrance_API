const router = require("express").Router();
const user = require("./user");
const category = require("./category");
const brand = require("./brand");
const currency = require("./currency");
const product = require("./product");
const customer = require("./customer");
const country = require("./country");
const invoice = require("./invoice");

router.use(user);
router.use(category);
router.use(brand);
router.use(currency);
router.use(product);
router.use(customer);
router.use(country);
router.use(invoice);

module.exports = router;