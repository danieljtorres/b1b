'use strict'

import axios from 'axios';
import jwtDecode from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://127.0.0.1:90/api/v0/auth/',
})

class AuthService {
    logIn(usuario, password) {
        return api.post('',{
            usuario: usuario,
            password: password
        }).then( response => {
            localStorage.setItem("token", response.data.data);

            let decoded = this.data();

            if (decoded.rol == 1 || decoded.rol == 2) {
                return {
                    response: response,
                    to: "AdminInit",
                }
            }

            if (decoded.rol == 3) {
                return {
                    response: response,
                    to: "CustomerInit"
                }
            }
        });
    }

    profile() {
        return api.get('',{
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
                "Authorization":  this.token()
            }
        });
    }

    edit(user) {
        let userData = {
            pais_id: user.pais_id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            telefono: user.telefono,
            usuario: user.usuario,
            email: user.email,
            password: user.password
        }

        return api.put('', userData, {
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
                "Authorization": this.token()
            }
        });
    }

    changeAvatar(form) {
        return api.put('avatar', form, {
            headers: {
                "Accept": "application/json",
                "Content-type": "multipart/form-data",
                "Authorization": this.token()
            }
        }).then(response => {

            return response.data.data.avatar

        })
    }

    check() {
        return localStorage.getItem("token") ? true : false;
    }

    data() {
        return jwtDecode(localStorage.getItem("token")).data || false;
    }

    token() {
        return localStorage.getItem("token") || false;
    }
}

export default new AuthService();