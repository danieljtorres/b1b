'use strict'

import Service from './Service';

class AsociatedService extends Service {

    associatesList() {
        return super.api().get('asociaciones');
    }
    associatesApproval(id) {
        return super.api().put('asociaciones' + id);
    }
}

export default new AsociatedService();