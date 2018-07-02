'use strict'

import Service from "./Service";

class InvestmentService extends Service {

    newInvestment(form) {

        return super.api().post('inversiones', form, {
            headers: {
                'Authorization': super.token(),
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getInvestments(limit = 10, offset = 0) {

        return super.api().get('auth/inversiones/activo',{
            headers: {
                'Authorization': super.token(),
                
            },
            params: {
                limit: limit,
                offset: offset
            }
        });

    }


}

export default new InvestmentService();