'use strict';

const Router = require('express').Router();

Router.get('/', (req, res) => { res.send('Api version 1') });

const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname);

files.forEach(file => {
	let name = path.basename(file, ".js");
	if (name !== "index") { Router.use(`/${name.toLowerCase()}`, require(`./${name}`));}
});

module.exports = Router;