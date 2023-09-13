'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const Invoices = require('../models/invoice')(sequelize, DataTypes);
const InvoicesItems = require('../models/invoiceitems')(sequelize, DataTypes);
const Product = require('../models/product')(sequelize, DataTypes);
const Stock = require('../models/stock')(sequelize, DataTypes);

Stock.hasOne(Product, { foreignKey: "stockId" });
Product.belongsTo(Stock, { foreignKey: "stockId" });

router.post('/pos', async(req, res) => {
    try{
        const data = req.body;
        const token = req.cookies['auth-token'];
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const findInv = await Invoices.findOne({order: [["id", "DESC"]]});
        const No = findInv?.invoiceNo.split('-')[1] || 0;
        let invoiceNo = 'INV-' + String(Number(No) + 1).padStart(4, '0');

        const mapProdId = data.items.map(m => {
            return m.productId
        })
        let overQty = false;
        let findStock = await Product.findAll({where:{id: {[Op.in]: mapProdId}}, include:[{model: Stock}]})
        .then((resData) => {
            resData.forEach( (e) => {
                const qty = data.items.find(f => f.productId == e.id).qty;
                if(e.Stock.saleQty < qty){
                    overQty = true;
                }
            });
        });

        if(overQty){
          return  res.status(200).json('Sorry, There is not enough product stock.');
        }
        

        findStock.forEach( async(e) => {
            const qty = data.items.find(f => f.productId == e.id).qty;
            await Stock.increment({saleQty: - qty}, { where:{ id: e.stockId }});
        });

        let updateStock = await Product.findAll({where:{id: {[Op.in]: mapProdId}}, include:[{model: Stock}]})
        res.status(200).json(updateStock);

        // const compareFunc = (a, b) => {
        //     if(a <= b){
        //         return true;
        //     }
        // }

        // const addInv = await Invoices.create({
        //     cancelBy: null,
        //     cancelNote: null,
        //     status: 1,
        //     invoiceNo: invoiceNo,
        //     cashierId: decoded.userId,
        //     bankAmount: data.bankAmount,
        //     cardAmount: data.cardAmount,
        //     cashAmount: data.cashAmount,
        //     customerId: data.customerId,
        //     discountAmount: data.discountAmount,
        //     discountPercent: data.discountPercent,
        //     saleNote: data.saleNote,
        //     tax: data.tax,
        //     taxAmount: data.taxAmount,
        //     totalAmount: data.totalAmount,
        //     changeAmount: data.changeAmount
        // }).then( async(invAdd) => {
        //     const mapItems = data.items.map((m) => {
        //         return {
        //             invoiceId: invAdd.id,
        //             productId: m.productId,
        //             price: m.price,
        //             currencyId: m.currencyId,
        //             rate: m.rate,
        //             qty: m.qty,
        //             isFree: m.isFree
        //         }
        //     })
        //     await InvoicesItems.bulkCreate(mapItems);
        //     const mapData = {
        //         id: invAdd.id,
        //         invoiceNo: invAdd.invoiceNo,
        //         cashierId: decoded.userId,
        //         employeeName: decoded.employeeName,
        //         createdAt: invAdd.createdAt,
        //     }
        //     res.status(200).json(resData(true, 'Add invoice successfully.', mapData, 0));
        // })
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;