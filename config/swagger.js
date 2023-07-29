"use strict";
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require("swagger-jsdoc");

function swaggerFunc() {
    const options = {
        definition:{
            openapi:"3.0.0",
            info:{
                title:"HSMM Api docs.",
                version:"0.0.1",
                description:"Hello world. Welcome to..."
            },
            servers:[
                {
                    url:`http://localhost:${process.env.APP_PORT}`
                }
            ],
        },
        apis:["./swagger/*.js"],
    }
    return swaggerJSDoc(options);
}

module.exports = {
    swaggerUi,
    swaggerFunc, 
};
