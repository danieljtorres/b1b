'use strict'

import Service from './Service';

class CountryService extends Service {
    getAll() {
        return super.api().get('paises');
    }
}

export default new CountryService();