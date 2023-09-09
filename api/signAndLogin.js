'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require('../models/user')(sequelize, DataTypes);
const Employees = require('../models/employee')(sequelize, DataTypes);
Users.hasOne(Employees, { foreignKey: "userId" });
Employees.belongsTo(Users, { foreignKey: "userId" });
router.post('/register', async(req, res) =>{
    try{
        const {userName, password, userType} = req.body;
        if(!(userName && password && userType)){
            return res.status(400).send("All input is required.");
        }
        const findUser = await Users.findOne({where:{userName:userName}});
        if(findUser){
            return res.status(409).send("User already exist. Please login");
            
        }
        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        //Create user
        const createUser = await Users.create({
            userName: userName.toLowerCase(),
            password: encryptedPassword,
            userType: userType, //1-employee, 2-customer
        })
        //Create token
        // const token = await jwt.sign(
        //     {userId: createUser.id, userName}, 
        //     process.env.TOKEN_KEY,
        //     {
        //         expiresIn:"2h"
        //     }
        // )
        // createUser.token = token;
        // await createUser.save()
        res.status(201).json(createUser);
    }catch (err){
        console.log(err);
    }
})

router.post('/login', async(req, res) => {
    try{
        const {userName, password} = req.body;
        if(!(userName && password)){
            return res.status(400).send("All input is required.");
        }
        let findUser = await Users.findOne({where:{userName: userName}, include:[{model: Employees}]});

        if(findUser && await bcrypt.compare(password, findUser.password)){
            const token = await jwt.sign(
                {userId: findUser.id, userName, employeeName: findUser.Employee.firstName},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"20h"
                }
            )
            const mapData = {
                userId: findUser.id,
                userName: findUser.userName
            }
            res.cookie("auth-token", token);
            res.cookie("userId", findUser.id)
            res.cookie("employee", findUser.Employee.firstName)
            
            return res.status(200).json(mapData);
        }
        res.status(400).send("The username or password is incorrect.");
    }catch (err){
        console.log(err);
    }
})

module.exports = router;