'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const Invoices = require('../models/invoice')(sequelize, DataTypes);
const InvoicesItems = require('../models/invoiceitems')(sequelize, DataTypes);


router.post('/pos', async(req, res) => {
    const data = req.body;
    const token = req.cookies['auth-token'];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const findInv = await Invoices.findOne({order: [["id", "DESC"]]})
    const No = findInv?.invoiceNo.split('-')[1] || 0;
    let invoiceNo = 'INV-' + String(Number(No) + 1).padStart(4, '0');
    const addInv = await Invoices.create({
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
        const mapData = {
            id: invAdd.id,
            invoiceNo: invAdd.invoiceNo,
            cashierId: decoded.userId,
            employeeName: decoded.employeeName,
            createdAt: invAdd.createdAt,
        }
        res.status(200).json(resData(true, 'Add invoice successfully.', mapData, 0));
    })
    
})

module.exports = router;