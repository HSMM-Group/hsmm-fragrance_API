'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sh = require("./shared")
const Categories = require('../models/category')(sequelize, DataTypes);

router.get('/category/get', async(req, res) =>{
    try{
        const findAll = await Categories.findAll({order:[["id","DESC"]]})
        res.status(200).json(resData(true,'Get category successfully.', findAll));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.post('/category/add', sh.uploadImage().single('file'), async(req, res) =>{
    try{
        const {image, categoryName, description} = req.body;
        if(!(categoryName)){
            return res.status(400).json(resData(false, 'Category Name is required.', null));
        }
        const findCate = await Categories.findOne({where:{categoryName: categoryName}});
        if(findCate){
            return res.status(400).json(resData(false, 'There is already a category.', null));
        }
        const addCate = await Categories.create({
            categoryName: categoryName,
            description: description,
            image: image
        })
        res.status(200).json(resData(true,'Add category successfully.', addCate));
    }catch (err){
        res.status(500).json(resData(false, err.message, null));
    }
})

router.put('/category/update', sh.uploadImage().single('file'), async(req, res) =>{
    try{
        const {id, image, categoryName, description} = req.body;
        if(!(categoryName)){
            return res.status(400).json(resData(false, 'Category Name is required.', null));
        }
        const findCateName = await Categories.findOne({where:{categoryName: categoryName}});
        if(findCateName && findCateName.id != id){
            return res.status(400).json(resData(false, 'There is already a category.', null));
        }
        const updateCate = await Categories.update(
            {
                categoryName: categoryName,
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