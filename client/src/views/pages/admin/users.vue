<template>
   <div class="md-gutter">
        <div class="md-layout-item">
            <md-tabs  >
            
                <md-tab id="tab-home" md-label="Clientes" md-icon="note_add">
                
                  <client-list></client-list>
                </md-tab>

            </md-tabs>        
        </div>
    </div>
</template>


<script>

import ClientList from "./Users/ClientList.vue";
export default {
  components:{
    ClientList  
}

};
</script>



<style>

</style>
