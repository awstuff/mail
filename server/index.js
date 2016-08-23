"use strict";

const express = require("express");
let app = express();

const compression = require("compression");
app.use(compression());

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	limit: "50mb",
	extended: true
}));
app.use(bodyParser.json({
	limit: "50mb"
}));

const config = require("./config");


const requestIp = require("request-ip");
app.use(requestIp.mw());


const createDeviceId = require("./app/util/auth/deviceId");
app.use(createDeviceId.create);


const router = express.Router();
require("./app/routes")(router);

app.use("/" + config.apiPath, router);
let port = process.env.PORT || config.port;
app.listen(port);
console.log("working hard at http://localhost:" + port + "/" + config.apiPath + " yo.");


const mysql = require("mysql");
global.db = mysql.createConnection({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database
});
db.connect(function (err) {
	if (err) {
		console.log(err.stack);
	}
});

//console.log("initializing export folder...");
//const path = require("path");
//global.temporaryExportFolder = path.resolve(__dirname + "/" + config.temporaryExportFolderName);
//
//const createExportFolder = require("./app/util/fs/createExportFolder");
//createExportFolder();
//
//const deleteExportFolderContents = require("./app/util/fs/deleteExportFolderContents");
//deleteExportFolderContents();

const attachmentlinkWatchdog = require("./app/util/attachmentlinks/watchdog");
attachmentlinkWatchdog.start();