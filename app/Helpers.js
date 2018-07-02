'use strict';

const crypto = require('crypto');
const fs     = require('fs');

//Archivo para funciones custom
//Se agrega la funcion al json helpers para que este disponible en cualquier archivo donde lo requieran

//Genera un string random
exports.randomStr = (l = 16, c) => { 
    if (c == null || c == 'l') {
        return crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, l).toLowerCase() 
    } else {
        return crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, l).toUpperCase()    
    }
}

exports.capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

exports.uploadFile = (oldPath, newPath, name) => {

    newPath = __basePath + newPath + name;

    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, function (err) {
            if (err) { 
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

exports.deleteFile = (path) => {

    path = __basePath + path;

    return new Promise((resolve, reject) => {
        if ( fs.existsSync(path) ) {
            fs.unlink(path, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        } else {
            resolve(true);
        }
    })
}

exports.asyncForEach = async (array, callback) => {
    if (!array) return;
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index)
    }
}