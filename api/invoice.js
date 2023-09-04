'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared");
const jwt = require('jsonwebtoken');
const Invoices = require('../models/invoice')(sequelize, DataTypes);
const InvoicesItems = require('../models/invoiceitems')(sequelize, DataTypes);
const Customers = require('../models/customer')(sequelize, DataTypes);
const Users = require('../models/user')(sequelize, DataTypes);
const Employees = require('../models/employee')(sequelize, DataTypes);
const Product = require('../models/product')(sequelize, DataTypes);

Customers.hasOne(Invoices, { foreignKey: "customerId" });
Invoices.belongsTo(Customers, { foreignKey: "customerId" });
Invoices.hasMany(InvoicesItems, { foreignKey: "invoiceId" });
InvoicesItems.belongsTo(Invoices, { foreignKey: "invoiceId" });
Product.hasMany(InvoicesItems, { foreignKey: "productId" });
InvoicesItems.belongsTo(Product, { foreignKey: "productId" });
Users.hasOne(Employees, { foreignKey: "userId" });
Employees.belongsTo(Users, { foreignKey: "userId" });
Users.hasOne(Invoices, { foreignKey: "cashierId" });
Invoices.belongsTo(Users, { foreignKey: "cashierId" });
router.get('/invoice', async (req, res) => {
    try {
        const { kw, count, skip, startDate, endDate } = req.query;
        const findAll = await Invoices.findAndCountAll({
            attributes:["id", "invoiceNo", "totalAmount", "cashAmount","bankAmount", "cardAmount","status", "createdAt"],
            where: {
                createdAt:{
                    [Op.between]:[startDate, endDate],
                },
                [Op.or]:[
                    {invoiceNo: { [Op.substring]: kw || '' }},
                ]
            },
            include:[
                {model: Customers, attributes:["id", "name"]}, 
                {model: Users, attributes:["id"], include:[
                    {model: Employees, attributes:["id", "firstName", "lastName"]}
                ]}
            ],
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count) | null,
            limit: Number(count) > 0?Number(count) : null,
        })
        res.status(200).json(resData(true, 'Get invoice successfully.', findAll.rows, findAll.count));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.get('/invoiceDetail', async (req, res) => {
    try {
        const id = req.query.id;
        let findDetails = await Invoices.findOne({
            where:{id: id},
            include:[
                {model: InvoicesItems, include:[{model: Product, attributes:["name", "coverImage"]}]}, 
                {model: Customers, attributes:["name", "phone", "address"]},
                {model: Users, attributes:["id"], include:[
                    {model: Employees, attributes:["id", "firstName", "lastName"]}
                ]}
            ]
        })
        if(findDetails?.cancelBy > 0){
            const findEmployee = await Employees.findByPk(findDetails?.cancelBy);
            findDetails['cancelName'] = 'findEmployee.firstName';
        }
        res.status(200).json(resData(true, 'Get invoice successfully.', findDetails, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})
 
router.put('/cancelInvoice', async (req, res) => {
    try {
        const {id, cancelNote} = req.body;
        const token = req.cookies['auth-token'];
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const findUpdate = await Invoices.update(
            {status: 0, cancelNote: cancelNote, cancelBy: decoded?.userId},
            {where:{id: id}}
        )
        res.status(200).json(resData(true, 'Cancel invoice successfully.', findUpdate, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;