'use strict'

import axios from 'axios';
import jwtDecode from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://127.0.0.1:90/api/v0/usuarios/clientes',
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
    }
});

class UserService {

    getClients() {

        return api.get('', {

        });
    }

}

export default new UserService();