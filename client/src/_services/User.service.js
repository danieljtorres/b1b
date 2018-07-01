'use strict'

import Service from "./Service";

class UserService extends Service {

    getClients(limit = 10, offset = 0) {
        return super.api().get('usuarios/clientes', {
            headers: {
                "Authorization": super.token(),
            },
            params: {
                limit: limit,
                offset: offset
            }
        });
    }

}

export default new UserService();