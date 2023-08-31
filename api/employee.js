'use strict';
const { sequelize, DataTypes } = require("../config/database");
const router = require('express').Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Employees = require('../models/employee')(sequelize, DataTypes);
router.get('/employee', async (req, res) => {
    const findEmployee = await Employees.findAll();
    res.status(200).json(resData(true, 'Get invoice successfully.', findEmployee, 1));
});

module.exports = router;