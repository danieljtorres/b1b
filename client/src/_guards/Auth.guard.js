'use strict'

import AuthService from '@/_services/Auth.service';

import jwtDecode from 'jwt-decode';

export default function Auth(rols) {
    return (to, from, next) => {
        if (AuthService.check()) {
            let data = AuthService.data();

            if (data) {

                if (data.rol) {
                    if (rols.indexOf(data.rol) != -1) {
                        return next();
                    }

                    if (data.rol == 1 || data.rol == 2) {
                        console.log('admin')
                        return next({name: 'AdminInit'});
                    }

                    if (data.rol == 3) {
                        console.log('client')
                        return next({name: 'CustomerInit'});
                    }
                }
            }
        } else {
            next({name: "Login"});
        }
    }
}