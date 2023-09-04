'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared");
const Customers = require('../models/customer')(sequelize, DataTypes);

router.get('/customer', async (req, res) => {
    try {
        const { kw, count, skip } = req.query;
        const findAll = await Customers.findAndCountAll({
            where: {
                [Op.or]:[
                    {phone: { [Op.substring]: kw || '' }},
                    {name: { [Op.substring]: kw || '' }},
                ]
            },
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count),
            limit: Number(count) > 0?Number(count):null,
        })
        res.status(200).json(resData(true, 'Get product successfully.', findAll.rows, findAll.count));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/customer', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {name, phone, email, gender, countryId, address, image} = req.body;
        console.log(countryId);
        if (!name) {
            return res.status(400).json(resData(false, 'Customer name is required.', null));
        }
        const addCust = await Customers.create({
            name: name,
            phone: phone,
            email: email,
            gender: gender,
            countryId: countryId,
            address: address,
            image: image
        });
        res.status(200).json(resData(true, 'Add customer successfully.', addCust, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/customer', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const {id, name, phone, email, gender, countryId, address, image} = req.body;

        if (!name) {
            return res.status(400).json(resData(false, 'Customer name is required.', null));
        }
        const updateCust = await Customers.update({
            name: name,
            phone: phone | 0,
            email: email,
            gender: gender,
            countryId: countryId | 1,
            address: address,
            image: image
        }, { where: { id: id } });
        res.status(200).json(resData(true, 'Update customer successfully.', updateCust, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;