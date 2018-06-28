<template>
   <div class="md-gutter">
        <div class="md-layout-item">
            <md-tabs  >
            
                <md-tab id="tab-home" md-label="Asociados" md-icon="note_add">
                
                  <asociated-list></asociated-list>
                </md-tab>

                  <md-tab id="tab-home2" md-label="Por aprobar" md-icon="note_add">
                
                  <asociated-aprobation></asociated-aprobation>
                </md-tab>
            </md-tabs>        
        </div>
    </div>
</template>


<script>
import AsociatedList from "./Asociated/AsociatedList.vue";
import AsociatedAprobation from "./Asociated/AsociatedAprobation.vue";


  export default {
  components:{
AsociatedList,
AsociatedAprobation

  }
  }
   
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>
