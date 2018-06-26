'use strict';

const MMDBReader = require('mmdb-reader'),
    serverConfig = require('config/server');

module.exports = {
    iso: ip => {
        if (process.env.NODE_ENV == "development" && ip == null && ip == '127.0.0.1'){
            ip = serverConfig.server;
        }
        
        const reader = new MMDBReader( __basePath + '/docs/GeoIP2-Country.mmdb')
        return reader.lookup(ip);
    }
}