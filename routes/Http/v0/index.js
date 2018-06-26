'use strict';

const Router = require("express").Router();

Router.get("/", (res) => res.send('Api version 0'));
Router.get("/avatares/:avatar", (req, res) => res.sendFile(__basePath+'/resources/avatares/'+req.params.avatar));
Router.get("/avatares/documentos/clientes/:documento", (req, res) => {
	res.sendFile(__basePath+'/resources/documentos/clientes/'+req.params.documento) 
});
Router.get("/vouchers/:voucher", (req, res) => res.sendFile(__basePath+'/resources/vouchers/'+req.params.voucher));

const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname);

files.forEach(file => {
	let name = path.basename(file, ".js");
	if (name !== "index") { Router.use(`/${name.toLowerCase()}`, require(`./${name}`));}
});
module.exports = Router;