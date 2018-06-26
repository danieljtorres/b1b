'use strict'

import AuthService from '@/_services/Auth.service';

import jwtDecode from 'jwt-decode';

export default function CheckLoginAuth() {
    return (to, from, next) => {
        if (AuthService.check()) {
            let data = AuthService.data();

            if (data) {
                
                if (data.rol) {
                    
                    if (data.rol == 1 || data.rol == 2) {
                        next({name: 'AdminInit'});
                    }

                    if (data.rol == 3) {
                        next({name: 'CustomerInit'});
                    }
                }
            }
        } else {    
            next();
        }
    }
}