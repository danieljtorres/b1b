'use strict'

import Service from "./Service";

class UserService extends Service {

    getClients() {
        return super.api().get('usuarios/clientes', {
            headers: {
                "Authorization": super.token()
            }
        });
    }

}

export default new UserService();