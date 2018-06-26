'use strict';

const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname);

module.exports = (io) => {
	files.forEach(file => {
		let name = path.basename(file, ".js");
		if (name !== "index") { 
			require(`./${name}`)(io);
		}
	});
}