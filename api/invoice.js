'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared");
const Invoices = require('../models/invoice')(sequelize, DataTypes);

router.get('/invoice', async (req, res) => {
    try {
        const { kw, count, skip } = req.query;
        const findAll = await Invoices.findAndCountAll({
            where: {
                [Op.or]:[
                    {invoiceNo: { [Op.substring]: kw || '' }},
                ]
            },
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count) | null,
            limit: Number(count) > 0?Number(count) : null,
        })
        res.status(200).json(resData(true, 'Get invoice successfully.', findAll.rows, findAll.count));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/invoice', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {name, phone, email, gender, countryId, address, image} = req.body;

        if (!name) {
            return res.status(400).json(resData(false, 'Invoice name is required.', null));
        }
        const addCust = await Invoices.create({
            name: name,
            phone: phone | 0,
            email: email,
            gender: gender,
            countryId: countryId | 1,
            address: address,
            image: image
        });
        res.status(200).json(resData(true, 'Add invoice successfully.', addCust, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/invoice', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {id, name, phone, email, gender, countryId, address, image} = req.body;

        if (!name) {
            return res.status(400).json(resData(false, 'Invoice name is required.', null));
        }
        const updateCust = await Invoices.update({
            name: name,
            phone: phone | 0,
            email: email,
            gender: gender,
            countryId: countryId | 1,
            address: address,
            image: image
        }, { where: { id: id } });
        res.status(200).json(resData(true, 'Update invoice successfully.', updateCust, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;