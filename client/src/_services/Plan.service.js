'use strict'

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:90/api/v0/planes/',
})

class PlanService {
    getForInvestments() {
        return api.get('inversiones');
    }

    save(plan){

        return api.post('',{

            titulo: plan.title,
            tipo: plan.type,
            descripcion: plan.content,
            caracteristicas: "",
            porcentaje: 2,
            tiempo: plan.time,
            min: plan.min,
            max: plan.max,
            rendimiento: null

        }, {
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token")
            }
        });

    }

    delete(id){
        return api.delete(''+id);
    }
}

export default new PlanService();