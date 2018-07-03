<template>
  <div class="md-layout md-gutter init">
    <div v-for="value in investmentData._rendimientos_x_codigo" :key="value.id" class="md-layout-item md-size-25">

          <md-card>
      <md-card-header>
        <md-card-header-text>
            
            <span >{{value.creado  | formatDate }} </span>
          <div class="md-subhead">${{value.monto}}</div>
          
        </md-card-header-text>
        <md-card-actions>
            <md-button>cobrar </md-button>
             <md-switch  v-model="paymentItemId" :value="value.id" class="md-primary"></md-switch>
        </md-card-actions>
        
      </md-card-header>
      
    </md-card>
    </div>
    <p v-if="paymentItemId == 0">por favor seleccione Intereses a cobrar</p>
    <md-button class="md-button md-raised md-primary table-action md-theme-default" v-else>cobrar </md-button>
    
   
    </div>

    



 </template>

<script>

import InvestmentService from '@/_services/Investment.service.js';

export default{
    data: () => ({
        investmentData:[],
        paymentItemId: [],
		id : ''
	}),
    methods:{
     setInvestmentRecord(){
            InvestmentService.getInvestment(this.id).then(response => {
                console.log(response);
                this.investmentData = response.data.data;
                console.log(this.InvestmentData);
            },err => {
                console.log(err);
            });
        }
        },
    created(){
       this.id = this.$route.params.id; 
       this.setInvestmentRecord();
     
    }
}
</script>

<style>
.md-layout-item.md-size-25 {
    margin-bottom: .5%;
}
.md-switch.md-primary.md-theme-default {
    margin-top: 0px;
    margin-bottom: 0px;
}
.md-card-actions.md-alignment-right {
    margin-top: -8% !important;
}
</style>
