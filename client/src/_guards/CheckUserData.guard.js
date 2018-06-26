'use strict'

import AuthService from '@/_services/Auth.service';

import jwtDecode from 'jwt-decode';

export default function CheckUserData() {
    return (to, from, next) => {

        AuthService.profile().then(response => {

            let user = response.data.data;
        
        
            let isBase64;
            
            try {
                isBase64 = btoa(atob(user.avatar)) == user.avatar;
            } catch (err) {
                isBase64 = false;
            }
        
            if (isBase64) {
                this.avatar = 'data:image/png;base64,' + user.avatar;
            } else {
                this.avatar = user.avatar;
            }
        
            avatar no base64 
            telefono
            identificacion
            documento
            direccion
            ciudad
        
        }, err => {

        });
    }
}