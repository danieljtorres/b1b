<template>
     <div class="row">
                  

                   <md-card v-for="plan in plans"
                        class="card col-4 md-layout-item  text-center ml-2 "
                        style="padding-right: 0px;
                    padding-left: 0;">
                        <md-card-header>
                            <md-card-header-text class="md-primary">
                            <div class="md-title">{{plan.titulo}}</div>
                              <button
                                    v-on:click="deletePlan(plan.id)"
                                    type="button"
                                    class="close"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                            </md-card-header-text>
                        </md-card-header>
                        <md-card-content>
                                {{plan.descripcion}}
                        </md-card-content>

                        <md-card-actions >
                            <md-button  class=" button-blue md-primary">Invertir</md-button>
                        </md-card-actions>
                        
                        
                         <md-card-content class="card-footer text-muted pink white-text">
                             ${{plan.min}} hasta ${{plan.max}}
                        </md-card-content> 
                        
                         <md-card-content class="card-footer text-muted pink white-text">
                          duracion:{{plan.tiempo}}
                        </md-card-content> 

                    </md-card>
                
   
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
            planId: ''
        };
    },

    created() {

        this.PlanListing();

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