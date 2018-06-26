'use strict'

import axios from 'axios';
import jwtDecode from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://127.0.0.1:90/api/v0/asociaciones/',
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
    }
})


class AsociatedService {

    associatesList() {

        return api.get('');
    }
    associatesApproval(id) {

        return api.put('' + id);
    }


}


export default new AsociatedService();