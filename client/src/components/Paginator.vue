<template>
    <div class="md-layout md-alignment-center-left paginator-container">

        <div class="md-layout-item md-large-size-5 md-medium-size-25 md-small-size-15">
            {{page}} / {{totalPages}}
        </div>

        <div class="md-layout-item md-large-size-5 md-medium-size-25 md-small-size-15">
            <md-button @click="back()" :disabled="page == 1" class="md-raised md-mini paginator-button">
                <i class="material-icons">navigate_before</i>
            </md-button>
        </div>

        <div class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button @click="setPage(1)" class="md-raised paginator-button" v-bind:class="{'md-primary': page == 1}">
                1
            </md-button>
        </div>

        <div v-if="page < totalPages - 1 && page > 2 && totalPages > 6" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button disabled class="md-flat paginator-button">
                ...
            </md-button>
        </div>

        <div v-for="(i,index) in pages" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button @click="setPage(i)" class="md-raised paginator-button" v-bind:class="{'md-primary': page == i}">
                {{i}}
            </md-button>
        </div>
        <!--<div v-if="page > totalPages - 1 && totalPages > 6 || page < 3 && totalPages > 6" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button class="md-flat paginator-button">
                ..
            </md-button>
        </div>-->

        <div v-if="page < totalPages - 1 && page > 2 && totalPages > 6" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button disabled class="md-flat paginator-button">
                ...
            </md-button>
        </div>
        
        <div class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button @click="setPage(totalPages)" class="md-raised paginator-button" v-bind:class="{'md-primary': page == totalPages}">
                {{totalPages}}
            </md-button>
        </div>

        <div class="md-layout-item md-large-size-5 md-medium-size-25 md-small-size-15">
            <md-button @click="next()"  :disabled="page == totalPages" class="md-raised md-mini paginator-button">
                <i class="material-icons">navigate_next</i>
            </md-button>
        </div>

        <div class="md-layout-item md-size-100">
            {{pages}}
        </div>
    </div>
    
</template>
<script>
export default {
    props: {
        total: Number,
        limit: Number | String,
    },
    data() {
        return {
            page: 1,
            totalPages: Math.ceil(this.total/this.limit),
            pages: []
        }
    },
    created() {
        this.setInitPages();
    },
    watch: {
        limit: function(n,o) {
            this.totalPages = Math.ceil(this.total/n);
            this.setPages();
        }
    },
    methods: {
        next() {
            if(this.page == this.totalPages) return;
            this.page++;
            this.inNext();
        },
        back() {
            if(this.page == 1) return;
            this.page--;
            this.setPages();
        },
        setPage(n = false) {
            if(n) this.page = n;
            this.setPages();
        },
        setInitPages() {

            let sec = 2, pen = this.totalPages;

            if(!this.pages.length) {

                for (var i = sec; i < pen; i++) {
                    this.pages.push(i)
                }
                
                return;
            }

        },
        inNext() {
    
            if(this.totalPages > 6) {
                if (this.page == 1) {
                    this.pages = [];
                    for (var i = this.page + 1; i < this.totalPages; i++) {
                        if(i < this.page + 3) {
                            this.pages.push(i);
                        }
                    }
                    return;
                }

                if (this.page == this.totalPages) {
                    this.pages = [];
                    for (var i = this.totalPages; i > this.page - 2; i--) {
                        console.log(i)
                        this.pages.push(i);
                    }
                    this.pages = this.pages.reverse();
                    return;
                }
                
                if (this.page > this.pages[this.pages.length-1] - 1) {

                    this.pages.forEach((e,i) => {
                        this.pages[i] = this.pages[i] + 1;
                    });
                    return;
                }
                
                if (this.pages[0] > this.page) {

                    if (this.page >= 3){
                        this.pages.forEach((e,i) => {
                            this.pages[i] = this.pages[i] - 1;
                        });
                    }
                    return;
                }
            }
        }
    }
};
</script>
<style>
.paginator-button {
    width: 100% !important;
    min-width: 100% !important;
    margin: 0% !important;
}

.paginator-container {
    padding-top: 5px;
}

.paginator-container .md-layout-item {
    padding: 5px;
}
.paginator-input {
    margin: 0 !important;
    min-height: 100% !important;
    padding-top: 0 !important;
}

.paginator-input input {
    text-align: center !important;
    width: 100% !important; 
}
</style>
  