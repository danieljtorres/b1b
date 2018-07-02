<template>
    <div class="md-layout md-gutter">
        <div class="md-layout-item">
            <md-button to="/investments/new" class="md-raised md-primary table-action"><i class="fa fa-sign-in"></i>Nueva</md-button>
            <md-tabs>
                <md-tab id="tab-pages" md-label="Activas" md-icon="pages">
                    
                        <investment-list-active></investment-list-active>
                    
                </md-tab>
            </md-tabs>        
        </div>
    </div>
</template>

<script>
import InvestmentListActive from './Investment/InvestmentListActive.vue';

export default {
    components:{
        InvestmentListActive
    },
    data() {
        return {
        };
    },

    methods: {
    }
};
</script>


<style>
    md-button.table-action {
        margin-left: 0 !important;
    }
</style>
