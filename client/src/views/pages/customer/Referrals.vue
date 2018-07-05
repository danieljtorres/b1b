<template>
    <div class="md-layout-item md-layout md-gutter">
        <div class="md-layout-item">
            <md-tabs>
                <md-tab id="tab-pages" md-label="Referidos" md-icon="pages">
                    
                  <referral-new></referral-new>
                  <referral-list></referral-list>  
                </md-tab>
            </md-tabs>        
        </div>
    </div>
</template>

<script>

import ReferralNew from './Referrals/ReferralNew';
import ReferralList from './Referrals/ReferralList';

export default {
 components:{
     ReferralNew,
     ReferralList
 },

    data() {
        return {
        };
    },

    methods: {
    }
};
</script>
