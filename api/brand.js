'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared")
const Brand = require('../models/brand')(sequelize, DataTypes);

router.get('/brand', async(req, res) =>{
    try{
        const { kw, count, skip } = req.query;
        const findAll = await Brand.findAndCountAll({
            where: { name: { [Op.substring]: kw || '' } },
            order: [["id", "DESC"]],
            offset: Number(skip) * Number(count),
            limit: Number(count) > 0?Number(count):null,
        })
        res.status(200).json(resData(true, 'Get brand successfully.', findAll.rows, findAll.count));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/brand', sh.uploadImage().single('file'), async(req, res) =>{
    try{ 
        const {image, name, description} = req.body;
        if(!(name)){
            return res.status(400).json(resData(false, 'Brand Name is required.', null));
        }
        const findCate = await Brand.findOne({where:{name: name}});
        if(findCate){
            return res.status(400).json(resData(false, 'There is already a brand.', null));
        }
        const addCate = await Brand.create({
            name: name,
            description: description,
            image: image
        })
        res.status(200).json(resData(true,'Add brand successfully.', addCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/brand', sh.uploadImage().single('file'), async(req, res) =>{
    try{
        const {id, image, name, description} = req.body;
        if(!(name)){
            return res.status(400).json(resData(false, 'Brand Name is required.', null));
        }
        const findCateName = await Brand.findOne({where:{name: name}});
        if(findCateName && findCateName.id != id){
            return res.status(400).json(resData(false, 'There is already a brand.', null));
        }
        const updateCate = await Brand.update(
            {
                name: name,
                description: description,
                image: image
            },
            {
                where:{id:id}
            }
        );
        res.status(200).json(resData(true,'Update brand successfully.', updateCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})
 
module.exports = router;