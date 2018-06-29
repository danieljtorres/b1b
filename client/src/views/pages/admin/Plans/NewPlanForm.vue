<template>
        <div class="md-layout">
      
           <div class="md-layout-item ">
      <form novalidate class="md-layout" >
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">nuevo plan</div>
        </md-card-header>

        <md-card-content>
                      <div class="md-layout md-gutter">
                
                <div class="md-layout-item md-small-size-100">

                        <md-field>
                            <label>titulo del plan</label>
                            <md-input v-model="plan.title"  maxlength="30"></md-input>
                        </md-field>
                       
                        <md-field> 
                            <label>contenido</label>
                            <md-textarea md-autogrow v-model="plan.content" maxlength="180"></md-textarea>
                        </md-field>

                         <md-field>
                        <label for="type">tipo</label>
                        <md-select  v-model="plan.type" class="" id="type">
                            <md-option value="INVERSIONES">inversiones</md-option>
                            <md-option value="ASOCIACIONES">asociación</md-option>                  
                        </md-select>
                        </md-field>
                        </div>
                         </div>
                          <div class="md-layout md-gutter">
                
                <div class="md-layout-item md-small-size-100">
                 
                  <md-field>
                            <label>monto minimo</label>
                            <md-input type="number" v-model="plan.min"  maxlength="30"></md-input>
                        </md-field>
                         </div>
                         <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label>monto maximo</label>
                            <md-input type="number" v-model="plan.max"  maxlength="30"></md-input>
                        </md-field>
                         </div>
                         <div class="md-layout-item md-small-size-100">
                         <md-field>
                            <label>duracion</label>
                            <md-input type="number" v-model="plan.time"  maxlength="02"></md-input>
                        </md-field>
                         </div>
                 
                
                   
                     </div>
                </md-card-content>

       
          <md-card-actions>
          <md-button type="submit" class="md-primary" >Crear Plan</md-button>
        </md-card-actions>
        </md-card>
         </form>
       
                
                </div>
                     <div class="md-layout-item ">
                         
                    <md-card >
                        <md-card-header>
                            <md-card-header-text class="md-primary">
                            <div class="md-title">{{plan.title}}</div>
                            </md-card-header-text>
                        </md-card-header>
                        <md-card-content>
                                {{plan.content}}
                        </md-card-content>

                        <md-card-actions >
                            <md-button  class="button-blue md-primary">Invertir</md-button>
                        </md-card-actions>
                        
                        
                         <md-card-content class="card-footer text-muted pink white-text">
                             ${{plan.min}} hasta ${{plan.max}}
                        </md-card-content> 
                        
                         <md-card-content class="card-footer text-muted pink white-text">
                             {{plan.time}}
                        </md-card-content> 

                    </md-card>
              
                    </div>

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
            
                }
            
            },
    
    methods: {

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
        }

    }

}
</script>
