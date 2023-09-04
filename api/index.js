const router = require("express").Router();
const user = require("./user");
const category = require("./category");
const brand = require("./brand");
const currency = require("./currency");
const product = require("./product");
const customer = require("./customer");
const country = require("./country");
const invoice = require("./invoice");
const employee = require("./employee");
const pos = require("./pos");

router.use(user);
router.use(category);
router.use(brand);
router.use(currency);
router.use(product);
router.use(customer);
router.use(country);
router.use(invoice);
router.use(employee);
router.use(pos);

module.exports = router;