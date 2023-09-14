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
        data.items.forEach(e => {

        })

        data.items.forEach( (e) => {
            const qty = findStock.find(f => f.id == e.productId).Stock.saleQty;
            if(e.qty > qty){
                overQty = true;
            }
            findStock.find(f => f.id == e.productId).Stock.saleQty = qty - e.qty;
        });

        if(overQty){
          return  res.status(400).json(resData(false, 'Sorry, There is not enough product stock.', null, 0));
        }
        
        await Invoices.create({
            cancelBy: null,
            cancelNote: null,
            status: 1,
            invoiceNo: invoiceNo,
            cashierId: decoded.userId,
            bankAmount: data.bankAmount,
            cardAmount: data.cardAmount,
            cashAmount: data.cashAmount,
            customerId: data.customerId,
            discountAmount: data.discountAmount,
            discountPercent: data.discountPercent,
            saleNote: data.saleNote,
            tax: data.tax,
            taxAmount: data.taxAmount,
            totalAmount: data.totalAmount,
            grandTotal: data.grandTotal,
            changeAmount: data.changeAmount
        }).then( async(invAdd) => {
            const mapItems = data.items.map((m) => {
                return {
                    invoiceId: invAdd.id,
                    productId: m.productId,
                    price: m.price,
                    currencyId: m.currencyId,
                    rate: m.rate,
                    qty: m.qty,
                    isFree: m.isFree
                }
            })
            await InvoicesItems.bulkCreate(mapItems);
            data.items.forEach( async(e) => {
                const stockId = findStock.find(f => f.id == e.productId).stockId;
                await Stock.increment({saleQty: - e.qty}, { where:{ id: stockId }});
            });
            const mapData = {
                id: invAdd.id,
                invoiceNo: invAdd.invoiceNo,
                cashierId: decoded.userId,
                employeeName: decoded.employeeName,
                createdAt: invAdd.createdAt,
            }
            res.status(200).json(resData(true, 'Add invoice successfully.', mapData, 0));
        })
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;