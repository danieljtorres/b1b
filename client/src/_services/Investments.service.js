'use strict'

import Service from "./Service";

class InvestmentService extends Service {

    newInvestment(form) {

        return super.api().post('inversiones', form,
        {
            headers: {

                "Authorization": super.token(),
                'Content-Type': 'multipart/form-data'
            }

        });
    }

}

export default new InvestmentService();