// const morgan = require("morgan");
// const helmet = require("helmet");

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const api = require("./api");
const signAndLogin = require("./api/signAndLogin")
const swagger = require('./config/swagger');
const passport = require('passport');
const path = require('path');
const multer = require("multer");
const cookieParser = require('cookie-parser');
require("dotenv").config();
require("./auth/passport");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    allowHeaders: '*',
    allowMethods: '*',
    origin: 'http://localhost:4200',
    credentials: true,
  })
);
// app.use(morgan("dev"));
// app.use(helmet());
app.use(express.json());

global.resData = function resData(status, message, data, count) {
  let resData = {
    status : status,
    message: message,
    totalCount: count | 0,
    data : data
  }
  return resData
}
// app.get("/", (req, res) => {
//   res.json({
//     message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
//   });
// });
app.use(express.static("fragance-ui"));
const rootPath = path.join(__dirname, '/images');
app.use('/files', express.static(rootPath));


// app.use('/api', passport.authenticate("jwt", { session: false }), api);
app.use('/api', api);
app.use('/api-start', signAndLogin);
app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerFunc()))

app.use(errorHandler);
app.use(notFound);

module.exports = app;