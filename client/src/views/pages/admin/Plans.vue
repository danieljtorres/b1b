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

                <new-plan-form></new-plan-form>

                </md-tab>

    <!-- PLANS SECTION -->

                <md-tab
                    id="tab-pages"
                    md-label="Planes existentes"
                    md-icon="pages"
                >  
                <plan-listing></plan-listing>
    </md-tab>


    </md-tabs>
</div>
<br>


<!-- Grid column -->

</div>
</template>


<script>


import NewPlanForm from "./Plans/NewPlanForm.vue";
import PlanListing from "./Plans/PlanListing.vue";

export default {
    components:{
        NewPlanForm,
        PlanListing
    },
                }
</script>


<style>

.md-card{
         margin-top:0% !important; 
         width: 80%;
         text-align: center;

}
</style>
