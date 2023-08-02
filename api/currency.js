'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared")
const Currencies = require('../models/currency')(sequelize, DataTypes);

router.get('/currency', async(req, res) =>{
    try{
        const { kw, count, skip } = req.query;
        const findAll = await Currencies.findAndCountAll({
            where: { name: { [Op.substring]: kw || '' } },
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count),
            limit: Number(count),
        })
        res.status(200).json(resData(true, 'Get category successfully.', findAll.rows, findAll.count));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/currency', async(req, res) =>{
    try{ 
        const { name, rate} = req.body;
        if(!(name)){
            return res.status(400).json(resData(false, 'Currency Name is required.', null));
        }
        const findCate = await Currencies.findOne({where:{name: name}});
        if(findCate){
            return res.status(400).json(resData(false, 'There is already a Currency.', null));
        }
        const addCate = await Currencies.create({
            name: name,
            rate: rate | 0,
        })
        res.status(200).json(resData(true,'Add currency successfully.', addCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/currency', async(req, res) =>{
    try{
        const {id, name, rate} = req.body;
        if(!(name)){
            return res.status(400).json(resData(false, 'Currency Name is required.', null));
        }
        const findName = await Currencies.findOne({where:{name: name}});
        if(findName && findName.id != id){
            return res.status(400).json(resData(false, 'There is already a currency.', null));
        }
        const updateCate = await Currencies.update(
            {
                name: name,
                rate: rate
            },
            {
                where:{id:id}
            }
        );
        res.status(200).json(resData(true,'Update currency successfully.', updateCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})
 
module.exports = router;