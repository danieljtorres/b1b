'use strict'

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:90/api/v0/paises/',
})

class CountryService {
    getAll() {
        return api.get('');
    }
}

export default new CountryService();