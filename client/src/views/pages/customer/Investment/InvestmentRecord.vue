<template>
 
  <div class="md-layout md-gutter init">
 <div class="md-layout-item md-size-100" style="margin-bottom:2%;">
    <md-card>
      <md-card-header>
        <div class="md-title">  <md-button class="md-icon-button md-raised md-primary table-action md-theme-default "><md-icon>attach_money</md-icon></md-button></div>
      </md-card-header>

      <md-card-content style="text-align:center;">

        <h3 class=" md-subheading">{{investmentData._plan.titulo}}</h3>
        <div class="card-reservation">
                    <md-divider></md-divider>

                     <md-list class="md-dense">
  <div class="md-layout md-gutter init " style="align-self: auto;">
 <div class="md-layout-item md-size-20" >
        <md-list-item>
            <div class="md-list-item-text">
                <span>Aprobación</span>
                <span>{{investmentData.aprobado}}</span>
            </div>
        </md-list-item>
         </div>
          <div class="md-layout-item md-size-20" >

        <md-list-item>
            <div class="md-list-item-text">
                <span>Inversión</span>
                <span>${{investmentData.monto}}</span>
            </div>
        </md-list-item>
         </div>
         <div class="md-layout-item md-size-20" >

        <md-list-item>
            <div class="md-list-item-text">
                <span>Disponible</span>
                <span>${{investmentData._por_cobrar}}</span>
            </div>
        </md-list-item>

         </div>
         <div class="md-layout-item md-size-20" >

        <md-list-item>
            <div class="md-list-item-text">
                <span>Por cobrar</span>
                <span>${{paymentAmount}}</span>
            </div>
        </md-list-item>
        

         </div>
          <div class="md-layout-item md-size-20" >

        <md-list-item>
            <div class="md-list-item-text">
                <md-button class="md-button md-raised md-primary table-action md-theme-default" v-if="paymentItemId == 0">Solicitar todo </md-button>
                <md-button class="md-button md-raised md-primary table-action md-theme-default" v-else>Solicitar </md-button>
            </div>
        </md-list-item>
        

         </div>

         </div>
        </md-list>

        </div>
   
          </md-card-content>

    
    </md-card>
    </div>

    <div v-for="value in investmentData._rendimientos_x_codigo" :key="value.id" class="md-layout-item md-size-25">

          <md-card>
      <md-card-header>
        <md-card-header-text>
            
            <span >{{value.creado  | formatDate }} </span>
          <div class="md-subhead">${{value.monto}}</div>
          
        </md-card-header-text>
        <md-card-actions>
            <md-button > cobrar </md-button>
             <md-switch  v-model="paymentItemId"  @change="setPaymentAmount(value.monto)" :id="value.monto" :value="value.id" class="md-primary"></md-switch>
        </md-card-actions>
        
      </md-card-header>

    </md-card>
    </div>
    <p v-if="paymentItemId == 0">por favor seleccione Intereses a cobrar</p>
    
   
    </div>

    



 </template>

<script>

import InvestmentService from '@/_services/Investment.service.js';

export default{
    data: () => ({
        investmentData:[],
        paymentItemId: [],
        paymentAmount: 0,
		id : '',
	}),
    watch: {
		
			},
    methods:{
     setInvestmentRecord(){
            InvestmentService.getInvestment(this.id).then(response => {
                console.log(response);
                this.investmentData = response.data.data;
                console.log(this.InvestmentData);
            },err => {
                console.log(err);
            });
        },
        setPaymentAmount(amount){
                this.paymentAmount= parseFloat(this.paymentAmount) + parseFloat(amount);
                console.log(this.paymentAmount);
                
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
