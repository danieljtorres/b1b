import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default class Service {

    api() {
        return axios.create({
            baseURL: 'http://127.0.0.1:90/api/v0/'
        });
    }

    check() {
        return this.token() ? true : false;
    }

    data() {
        return jwtDecode(this.token()).data || false;
    }

    token() {
        return localStorage.getItem("token") || false;
    }

}