<template>
<div class="container">
    <div class="row">
        <!--          <div>
    <div class="phone-viewport">
      <md-bottom-bar md-type="shift">
        <md-bottom-bar-item md-label="Crear PLan" v-on:click='toggle' md-icon="note_add" ></md-bottom-bar-item>
        <md-bottom-bar-item md-label="Planes existentes"   v-on:click='toggle2' md-icon="pages" ></md-bottom-bar-item>
        
      </md-bottom-bar>
    </div>
  </div>
      -->
        <md-tabs class="md-gutter">
            <md-tab
                id="tab-home"
                class="md-layout"
                md-label="Crear PLan"
                md-icon="note_add"
            >
                <div class="md-layout-item col-6">
                    <form
                        class="card pl-2 pr-2 pb-2 pt-2"
                        @submit.prevent="createPlan"
                    >
                        <div class="form-group md-form">

                            <label
                                for="title"
                                class="bmd-label-floating"
                            >Titulo</label>
                                <input
                                    v-model="plan.title"
                                    type="text"
                                    class="form-control"
                                    id="title"
                                >

                        </div>

                        <div class="md-form form-group ">
                            <label
                                class="bmd-label-floating"
                                for="textareaBasic"
                            >Contenido</label>
                                <textarea
                                    v-model="plan.content"
                                    type="text"
                                    id="textareaBasic"
                                    class="form-control md-textarea"
                                    rows="3"
                                ></textarea>

                        </div>
                        <div class="form-group">

                            <select
                                v-model="plan.type"
                                class="form-control"
                                id="sel1"
                            >
                                <option
                                    value=""
                                    disabled
                                    selected
                                >Tipo de plan</option>
                                    <option value="INVERSIONES">inversión</option>
                                    <option value="ASOCIACIONES">asociación</option>

                                    </select>
                        </div>
                        <!-- Grid row -->
                        <div class="form-row">
                            <!-- Grid column -->
                            <div class="col">
                                <!-- Material input -->

                                <div class="md-form form-group">
                                    <label
                                        class="bmd-label-floating"
                                        for="time"
                                    >duracion</label>
                                        <input
                                            v-model="plan.time"
                                            id="time"
                                            type="number"
                                            class="form-control"
                                        >
                                </div>
                            </div>
                            <!-- Grid column -->
                            <div class="col">
                                <!-- Material input -->
                                <div class="md-form form-group">
                                    <label
                                        class="bmd-label-floating"
                                        for="min"
                                    >monto minimo</label>
                                        <input
                                            v-model="plan.min"
                                            id="min"
                                            type="number"
                                            class="form-control"
                                        >
                                </div>
                            </div>
                            <!-- Grid column -->
                            <div class="col">
                                <!-- Material input -->
                                <div class="md-form  form-group">
                                    <label
                                        class="bmd-label-floating"
                                        for="max"
                                    >monto maximo</label>
                                        <input
                                            v-model="plan.max"
                                            type="number"
                                            id="max"
                                            class="form-control"
                                        >
                                </div>
                            </div>
                            <!-- Grid column -->
                        </div>
                        <!-- Grid row -->

                        <button
                            type="submit"
                            class="btn align-self-center col-4 btn-primary "
                        >crear plan <i class="ti-check"></i></button>
                            </form>
                </div>

                <div class="md-layout-item col-6">

                    <div class="card text-center">

                        <div class="card-body">
                            <h4 class="card-title">{{plan.title}}</h4><br>
                            <p class="card-text">{{plan.content}}</p>
                            <a class="btn btn-secondary btn-sm waves-effect waves-light">Invertir</a>
                        </div>
                        <div class="card-footer text-muted pink white-text">
                            <p class="mb-0">de ${{plan.min}} hasta ${{plan.max}}</p>
                        </div>
                        <div class="card-footer text-muted pink white-text">
                            <p class="mb-0">duracion: {{plan.time}}</p>
                        </div>
                    </div>
                </div>
                </md-tab>

    <!-- PLANS SECTION -->

                <md-tab @click="PlanListing"
                    id="tab-pages"
                    md-label="Planes existentes"
                    md-icon="pages"
                >   <div class="row">
                    <div 
                        v-for="value in plans"
                        class="card col-4 md-layout-item  text-center ml-2 "
                        style="padding-right: 0px;
                    padding-left: 0;"
                    >

                        <div class="card-body ">
                            <h4 class="card-title"> {{value.titulo}}
                                <button
                                    v-on:click="deletePlan(value.id)"
                                    type="button"
                                    class="close"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                            </h4><br>
                            <p class="card-text"> {{value.descripcion}} </p>
                            <a class="btn btn-secondary btn-sm waves-effect waves-light">Invertir</a>
                        </div>
                        <div class="card-footer text-muted pl-0 pr-0 py pink white-text">
                            <p class="mb-0">de ${{value.min}} hasta ${{value.max}}</p>
                        </div>
                        <div class="card-footer text-muted pink white-text">
                            <p class="mb-0">duracion: {{value.tiempo}} año(s)</p>
                        </div>
    </div>
    </div>
    </md-tab>


    </md-tabs>
</div>
<br>


<!-- Grid column -->

</div>
</template>


<script>
import axios from "axios";
import VueJWT from 'vuejs-jwt';
import PlanService from "@/_services/Plan.service";
export default {
    data() {
        return {

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

    created() {

        

    },
    methods: {

        PlanListing() {

            PlanService.getForInvestments().then(
                response => {
                    //handle success
                    this.plans = response.data.data;
                    console.log(this.plans);
                },
                err => {
                    console.log(err);
                }
            );

        },

        createPlan() {

            PlanService.newPlan(this.plan).then(
                    response => {
                        //handle success

                        console.log(response);
                    },
                    err => {
                        console.log(err);
                    }
                );
        },
        deletePlan(id) {

            
        PlanService.erasePlan(id).then(
                response => {
                    //handle success

                    console.log(response);
                },
                err => {
                    console.log(err);
                }
            );
        }
    }
};
</script>


<style>

</style>
