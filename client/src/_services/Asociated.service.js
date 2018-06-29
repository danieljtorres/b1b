'use strict'

import Service from './Service';

class AsociatedService extends Service {

    associatesList() {
        return super.api().get('asociaciones',{

            headers: {
                "Authorization": super.token()
            }

        });

    }
    associatesApproval(id) {
        return super.api().put('asociaciones' + id, {
            headers: {
                "Authorization": super.token()
            }
        });
    
    }
}

export default new AsociatedService();