'use strict'

import Service from './Service';

class AuthService extends Service {

    logIn(usuario, password) {

        return super.api().post('auth',{
            usuario: usuario,
            password: password
        }).then( response => {
            localStorage.setItem("token", response.data.data);

            let decoded = super.data();

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
        return super.api().get('auth', {
            headers: {
                "Authorization": super.token()
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

        return super.api().put('auth', userData, {
            headers: {
                "Authorization": super.token()
            }
        });
    }

    changeAvatar(form) {
        return super.api().put('auth/avatar', form, {
            headers: {
                "Content-type": "multipart/form-data",
                "Authorization": super.token()
            }
        }).then(response => {

            return response.data.data.avatar

        })
    }
}

export default new AuthService();