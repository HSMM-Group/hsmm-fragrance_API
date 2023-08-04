'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared")
const Countries = require('../models/country')(sequelize, DataTypes);

router.get('/country', async (req, res) => {
    try {
        const { kw, count, skip } = req.query;
        const findAll = await Countries.findAndCountAll({
            where: { country: { [Op.substring]: kw || '' } },
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count) || null,
            limit: Number(count) > 0?Number(count):null,
        })
        res.status(200).json(resData(true, 'Get country successfully.', findAll.rows, findAll.count));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/country', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const { country, image } = req.body;
        if (!(country)) {
            return res.status(400).json(resData(false, 'Country Name is required.', null));
        }
        const findCountry = await Countries.findOne({ where: { country: country } });
        if (findCountry) {
            return res.status(400).json(resData(false, 'There is already a category.', null));
        }
        const addCountry = await Countries.create({
            country: country,
            image: image
        })
        res.status(200).json(resData(true, 'Add country successfully.', addCountry, 1));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/country', sh.uploadImage().single('file'), async (req, res) => {
    try {
        const { id, country, image } = req.body;
        if (!(country)) {
            return res.status(400).json(resData(false, 'Country Name is required.', null));
        }
        const findCountry = await Countries.findOne({ where: { name: name } });
        if (findCountry && findCountry.id != id) {
            return res.status(400).json(resData(false, 'There is already a category.', null));
        }
        const updateCountry = await Countries.update(
            {
                country: country,
                image: image
            },
            {
                where: { id: id }
            }
        );
        res.status(200).json(resData(true, 'Update category successfully.', updateCountry));
    } catch (err) {
        res.status(500).json(resData(false, err.message, null));
    }
})

module.exports = router;