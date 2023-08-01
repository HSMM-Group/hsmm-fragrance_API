'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared")
const Categories = require('../models/category')(sequelize, DataTypes);

router.get('/category', async(req, res) =>{
    try{
        const findAll = await Categories.findAll({order:[["id","DESC"]]})
        res.status(200).json(resData(true,'Get category successfully.', findAll));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/category', sh.uploadImage().single('file'), async(req, res) =>{
    try{ 
        const {image, name, description} = req.body;
        if(!(name)){
            return res.status(400).json(resData(false, 'Category Name is required.', null));
        }
        const findCate = await Categories.findOne({where:{name: name}});
        if(findCate){
            return res.status(400).json(resData(false, 'There is already a category.', null));
        }
        const addCate = await Categories.create({
            name: name,
            description: description,
            image: image
        })
        res.status(200).json(resData(true,'Add category successfully.', addCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/category', sh.uploadImage().single('file'), async(req, res) =>{
    try{
        const {id, image, name, description} = req.body;
        if(!(name)){
            return res.status(400).json(resData(false, 'Category Name is required.', null));
        }
        const findCateName = await Categories.findOne({where:{name: name}});
        if(findCateName && findCateName.id != id){
            return res.status(400).json(resData(false, 'There is already a category.', null));
        }
        const updateCate = await Categories.update(
            {
                name: name,
                description: description,
                image: image
            },
            {
                where:{id:id}
            }
        );
        res.status(200).json(resData(true,'Update category successfully.', updateCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})
 
module.exports = router;