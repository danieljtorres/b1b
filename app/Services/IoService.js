'use strict';

const moment = require('moment');

let clients = new WeakMap();
let conversations = new WeakMap();
let message = new WeakMap();

class IoService {

    constructor(){

        clients   = [];
        this.user = {
            id: null,
            username: null,
            sockets: [],
            rooms: [],
            lastAct: null,
        };

        conversations = [];

        message = {
            room: null,
            data: null
        };

    }

    getClients() {
        return clients;
    }

    addClient(socket , data) {

        let noExists = true;

        if (clients.length) {

            clients.forEach((client, i) => {
                if (client.id === data.id) {
                    noExists = false;
                    clients[i].sockets.push(socket);
                }
            })

        }

        if (noExists) {

            this.user.id       = data.id;
            this.user.username = data.username;
            this.user.lastAct  = moment().unix();
            
            this.user.sockets.push(socket);
    
            clients.push(this.user);
    
            this.user = this.resetUser();

        }

    }

    removeClient(socket , data) {

        clients.forEach((client, i) => {
            if (client.id === data.id) {
                clients[i].sockets.forEach((s,j) => {
                    if (s.id == socket.id) {
                        clients[i].sockets.splice(j,1)
                    }
                });

                if (!clients[i].sockets.length) {
                    clients.splice(i,1);
                }
            }
        })

    }

    newConversation(data) {
        
        let noExists = true;

        if (clients.length) {

            conversations.forEach((con, i) => {
                if ( (con.users[0] == data.from &&  con.users[1] == data.to) || (con.users[0] == data.to &&  con.users[1] == data.from) ) {
                    noExists = false;
                }
            })
        
        } else {

            conversations.push({
                name: null ,
                users: [data.from, data.to]
            })

        }
    }

    resetUser() {
        return {
            id: null,
            username: null,
            sockets: [],
            lastAct: null,
        };
    }
}

module.exports = IoService;