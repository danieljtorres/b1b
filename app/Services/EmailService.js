'use strict';

const nodemailer = require('nodemailer'),
    emailConfig  = require('config/email'),
    fs           = require('fs');

const mailerOptions = {
    service: emailConfig.service,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }       
};

class Email {

    constructor(){
        this.transporter = nodemailer.createTransport(mailerOptions);
        this.message = {};
        this.message.from = emailConfig.from;
        this.data = {};
    }

    setData(data) {
        Object.assign(this.data, data);
        return this;
    }

    setMssg(data) {
        Object.assign(this.message, data);
        return this;
    }

    setHtml(template) {
        this.template = fs.readFileSync(__basePath + '/resources/emails/'+template+'.html' ,'utf8', (err) => {
            if (err) throw err;
        });

        this.message.html = this.template;

        var keys = Object.keys(this.data);

        keys.forEach( (key, i) =>{
            while(this.message.html.indexOf("${"+key+"}") != -1){
                this.message.html = this.message.html.replace("${"+key+"}", this.data[key]);
            }
        })

        return this;
    } 

    setAttachs(attachs) {
        this.message.attachments = attachs;
        return this;
    }

    send(cb){
        return new Promise( (resolve, reject) => {
            this.transporter.sendMail(this.message, (err,info) => {
                if(err) reject(err);
                this.message = {};
                this.message.from = emailConfig.from;
                this.data = {};
                resolve(info);
            });
        });
    }
}

module.exports = new Email();