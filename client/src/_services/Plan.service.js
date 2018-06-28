'use strict'

import Service from './Service';

class PlanService extends Service {
    getForInvestments() {
        return super.api().get('planes/inversiones');
    }

    save(plan){

        return super.api().post('planes',{
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
                Authorization: super.token()
            }
        });
    }

    delete(id){
        return super.api().delete('planes'+id);
    }
}

export default new PlanService();