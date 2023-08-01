'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared");
const stock = require("../models/stock");
const Products = require('../models/product')(sequelize, DataTypes);
const Stocks = require('../models/stock')(sequelize, DataTypes);
const Brands = require('../models/brand')(sequelize, DataTypes);
const Categories = require('../models/category')(sequelize, DataTypes);

Brands.hasOne(Products, { foreignKey: "brandId" });
Products.belongsTo(Brands, { foreignKey: "brandId" });
Categories.hasOne(Products, { foreignKey: "categoryId" });
Products.belongsTo(Categories, { foreignKey: "categoryId" });
router.get('/product', async (req, res) => {
    try {
        const findAll = await Products.findAll({
            include: [{ model: Brands }, { model: Categories }],
            order: [["id", "DESC"]]
        })
        res.status(200).json(resData(true, 'Get product successfully.', findAll));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/product', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {
            name,
            brandId,
            categoryId,
            stock,
            price,
            currencyId,
            barcode,
            status,
            coverImage } = req.body;

        if (!(name)) {
            return res.status(400).json(resData(false, 'Product Name is required.', null));
        }
        const findCate = await Products.findOne({ where: { name: name } });
        if (findCate) {
            return res.status(400).json(resData(false, 'There is already a Currency.', null));
        }
        const addStock = await Stocks.create({
            saleQty: stock,
            displayQty: 0,
            testQty: 0
        })
        const addCate = await Products.create({
            name: name,
            brandId: brandId,
            categoryId: categoryId,
            stockId: addStock.id,
            price: price,
            currencyId: currencyId,
            barcode: barcode,
            status: status,
            coverImage: coverImage
        })
        res.status(200).json(resData(true, 'Add product successfully.', addCate));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/product', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const { id, name, rate } = req.body;
        if (!(name)) {
            return res.status(400).json(resData(false, 'Currency Name is required.', null));
        }
        const findName = await Products.findOne({ where: { name: name } });
        if (findName && findName.id != id) {
            return res.status(400).json(resData(false, 'There is already a currency.', null));
        }
        const updateCate = await Products.update(
            {
                name: name,
                rate: rate
            },
            {
                where: { id: id }
            }
        );
        res.status(200).json(resData(true, 'Update currency successfully.', updateCate));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;