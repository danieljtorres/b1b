<template>
    <div class="md-layout md-alignment-center-center paginator-container">
        <div class="md-layout-item md-large-size-5 md-medium-size-25 md-small-size-15">
            <md-button @click="back()" :disabled="page == 1" class="md-raised md-mini paginator-button arrow">
                <i class="material-icons">navigate_before</i>
            </md-button>
        </div>
        <div class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button @click="setPage(1)" class="md-raised paginator-button" v-bind:class="{'md-primary': page == 1}">
                1
            </md-button>
        </div>
        <div v-if="page < totalPages - 1 && page > 2 && totalPages > 6" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button class="md-flat paginator-button doted">
                ...
            </md-button>
        </div>
        <template v-for="(i,index) in pages" >
            <div class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
                <md-button @click="setPage(i)" class="md-raised paginator-button" v-bind:class="{'md-primary': page == i}">
                    {{i}}
                </md-button>
            </div>
            <div v-if="page > totalPages - 2 && totalPages > 6 && index == 1 || page < 3 && totalPages > 6 && index == 1" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
                <md-button class="md-flat paginator-button doted">
                    ...
                </md-button>
            </div>
        </template>
        <div v-if="page < totalPages - 1 && page > 2 && totalPages > 6" class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button class="md-flat paginator-button doted">
                ...
            </md-button>
        </div>
        <div class="md-layout-item md-large-size-5 md-medium-size-10 md-small-size-15">
            <md-button @click="setPage(totalPages)" class="md-raised paginator-button" v-bind:class="{'md-primary': page == totalPages}">
                {{totalPages}}
            </md-button>
        </div>
        <div class="md-layout-item md-large-size-5 md-medium-size-25 md-small-size-15">
            <md-button @click="next()"  :disabled="page == totalPages" class="md-raised md-mini paginator-button arrow">
                <i class="material-icons">navigate_next</i>
            </md-button>
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
            this.page = 1;
            this.totalPages = Math.ceil(this.total/parseFloat(n));
            this.setInitPages();
        }
    },
    methods: {
        next() {
            if(this.page == this.totalPages) return;
            this.page++;
            this.inOneStep();
            this.pageChanged();
        },
        back() {
            if(this.page == 1) return;
            this.page--;
            this.inOneStep();
            this.pageChanged();
        },
        setPage(n = false) {
            if(n) this.page = n;
            this.inOneStep();
            this.pageChanged();
        },
        setInitPages() {
            let sec = 2;
            this.pages = [];
            // Hasta 6 paginas
            if(!this.pages.length && this.totalPages < 7) {
                for (var i = sec; i < this.totalPages; i++) {
                    this.pages.push(i)
                }
                return;
            } else if (!this.pages.length && this.totalPages > 7) {
                for (var i = sec; i < this.totalPages; i++) {
                    if (i < 4) this.pages.push(i)
                    if (this.totalPages - 3 < i) this.pages.push(i)
                }
                return;
            }
        },
        inOneStep() {
            if(this.totalPages > 6) {
                this.pages = [];
                if (this.page > 2 && this.page < this.totalPages - 1) {
                    for (var i = this.page - 1; i < this.totalPages; i++) {
                        console.log(this.pages.length ,i)
                        if (this.pages.length < 3) this.pages.push(i)
                    }
                    return;
                } else {
                    this.setInitPages();
                }
            }
        },
        pageChanged() {
            this.$emit('pageChanged', this.page);
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

.paginator-button.doted .md-button-content {
    top: 10px;
}
.paginator-button.arrow .md-button-content {
    top: 2px;
}
</style>
  