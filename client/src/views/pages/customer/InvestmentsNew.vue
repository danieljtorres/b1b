<template>
    <div class="md-layout md-gutter">
        <div class="md-layout-item">
            <md-steppers :md-active-step.sync="active" md-linear>
                <md-step id="first" md-label="Plan" md-description="Opcional" :md-done.sync="first">
                    <div v-for="value in plans" class="card col-4 md-layout-item text-center ml-2 " style="padding-right: 0px; padding-left: 0;">

                        <div class="card-body">
                            <h4 class="card-title">{{value.titulo}}</h4><br>
                            <p class="card-text">{{value.contenido}}</p>
                            <md-button class="md-raised md-primary" @click="setDone('first', 'second')">Invertir</md-button>
                        </div>
                        <div class="card-footer text-muted pl-0 pr-0 py pink white-text">
                            <p class="mb-0">de ${{value.min}} hasta ${{value.max}}</p>
                        </div>
                        <div class="card-footer text-muted pink white-text">
                            <p class="mb-0">duracion: {{value.tiempo}} año(s)</p>
                        </div>

                    </div>
                </md-step>

                <md-step id="second" md-label="Monto" :md-error="secondStepError" :md-done.sync="second">
                    <md-field>
                        <label>Monto</label>
                        <span class="md-prefix">$</span>
                        <md-input v-model="initial"></md-input>
                    </md-field>
                    <md-button class="md-raised md-primary" @click="setDone('second', 'third')">Continuar</md-button>
                    <md-button class="md-raised md-primary" @click="setError()">Error!</md-button>
                </md-step>

                <md-step id="third" md-label="Detalles" :md-done.sync="third">
                    <md-field>
                        <label>Baucher</label>
                        <md-file v-model="single" />
                    </md-field>
                    <md-button class="md-raised md-primary" @click="setDone('third')">Hecho!</md-button>
                </md-step>
            </md-steppers>
        </div>
    </div>
</template>

<script>
import planService from '@/_services/Plan.service';

export default {
    data() {
        return {
            active: 'first',
            first: false,
            second: false,
            third: false,
            secondStepError: null,
            plans: "",
            plan: {
                title: "",
                content: "",
                type: "",
                time: "",
                min: "",
                max: ""
            },
            planId: ''
        };
    },

    created() { this.getPlansForInvestments(); },

    methods: {
        setDone (id, index) {
            this[id] = true

            this.secondStepError = null

            if (index) {
            this.active = index
            }
        },
        setError () {
            this.secondStepError = 'Revisa la informacion!'
        },
        getPlansForInvestments() {
            planService.getForInvestments().then(
                response => {
                    this.plans = response.data.data;
                },
                err => {
                    console.log(err);
                }
            );
        },

        createPlan() {
            planService.save(this.plan).then(response => {
                console.log(response);
            }, err => {
                console.log(err);
            });
        },

    }
};
</script>

<style>

</style>