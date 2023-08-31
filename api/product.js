'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared");
const Products = require('../models/product')(sequelize, DataTypes);
const Stocks = require('../models/stock')(sequelize, DataTypes);
const Brands = require('../models/brand')(sequelize, DataTypes);
const Categories = require('../models/category')(sequelize, DataTypes);
const Currencies = require('../models/currency')(sequelize, DataTypes);
 
Brands.hasOne(Products, { foreignKey: "brandId" });
Products.belongsTo(Brands, { foreignKey: "brandId" });
Categories.hasOne(Products, { foreignKey: "categoryId" });
Products.belongsTo(Categories, { foreignKey: "categoryId" });
Stocks.hasOne(Products, { foreignKey: "stockId" });
Products.belongsTo(Stocks, { foreignKey: "stockId" });
Currencies.hasOne(Products, { foreignKey: "currencyId" });
Products.belongsTo(Currencies, { foreignKey: "currencyId" });
router.get('/product', async (req, res) => {
    try {
        const { kw, count, skip } = req.query;
        const findAll = await Products.findAndCountAll({
            where: {
                [Op.or]:[
                    {id: { [Op.substring]: kw || '' }},
                    {name: { [Op.substring]: kw || '' }},
                    {barcode: {[Op.substring]: kw || ''}}
                ]
            },
            include: [
                { model: Brands, attributes: ['id', 'name'] },
                { model: Categories, attributes: ['id', 'name'] },
                { model: Stocks, attributes: ['id', 'saleQty'] },
                { model: Currencies, attributes: ['id', 'name', 'rate'] }
            ],
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count),
            limit: Number(count) > 0?Number(count):null,
        })
        res.status(200).json(resData(true, 'Get product successfully.', findAll.rows, findAll.count));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})
router.get('/product/byid', async (req, res) => {
    try {
        const { id } = req.query;
        const findAll = await Products.findByPk(id, {
            include: [
                { model: Brands, attributes: ['id', 'name'] },
                { model: Categories, attributes: ['id', 'name'] },
                { model: Stocks, attributes: ['id', 'saleQty'] },
                { model: Currencies, attributes: ['id', 'name', 'rate'] }
            ]
        })
        res.status(200).json(resData(true, 'Get product successfully.', findAll, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})
router.post('/product', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {name,brandId,categoryId,stock,price,currencyId,barcode,status,coverImage} = req.body;

        if (!(name && brandId && categoryId)) {
            return res.status(400).json(resData(false, 'Input is required.', null));
        }
        const findProd = await Products.findOne({ where: { name: name } });
        if (findProd) {
            return res.status(400).json(resData(false, 'There is already a Product Name.', null));
        }
        await Stocks.create({
            saleQty: stock,
            displayQty: 0,
            testQty: 0
        }).then(async (stock) => {
            const addCate = await Products.create({
                name: name,
                brandId: brandId,
                categoryId: categoryId,
                stockId: stock.id,
                price: price,
                currencyId: currencyId,
                barcode: barcode,
                status: status,
                coverImage: coverImage
            })
            res.status(200).json(resData(true, 'Add product successfully.', addCate));
        })
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/product', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {id,name,brandId,categoryId,stock,price,currencyId,barcode,status,coverImage} = req.body;

        if (!(name && brandId && categoryId)) {
            return res.status(400).json(resData(false, 'Input is required.', null));
        }
        const findName = await Products.findOne({ where: { name: name } });
        if (findName && findName.id != id) {
            return res.status(400).json(resData(false, 'There is already a product name.', null));
        }
        let findProd = await Products.findOne({where:{id: id}, include:[{model: Stocks}]})
        findProd.name = name;
        findProd.brandId = brandId;
        findProd.categoryId = categoryId;
        findProd.price = price;
        findProd.currencyId = currencyId;
        findProd.barcode = barcode;
        findProd.status = status;
        findProd.coverImage = coverImage;
        findProd.Stock.saleQty = stock;
        await findProd.Stock.save();
        const updateProd = await findProd.save();
        res.status(200).json(resData(true, 'Update product successfully.', updateProd));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;