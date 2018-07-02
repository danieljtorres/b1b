<template>
    <div class="md-layout md-gutter init">
        <div class="md-layout-item md-size-33">
            <md-card class="md-card-example">
                <md-card-area md-inset>
                    <md-card-media md-ratio="16:9">
                        <img src="http://emprendedorestv.pe/wp-content/uploads/2016/01/bigstock-Vector-flat-modern-icons-on-sa-594196791-1-1024x576.jpg" alt="Coffee House">
                    </md-card-media>

                    <md-card-header>
                        <h5 class="md-title">Tus inversiones<span>10</span></h5>
                    </md-card-header>
                </md-card-area>

                <md-card-content>
                    <md-list class="md-dense">
                        <md-list-item>
                            <md-icon>trending_up</md-icon>
                            <span class="md-list-item-text">Activas </span>
                            <md-badge class="md-primary" md-content="3" />
                        </md-list-item>
                    
                        <md-list-item>
                            <md-icon>trending_flat</md-icon>
                            <span class="md-list-item-text">En espera</span>
                            <md-badge class="md-primary" md-content="3" />
                        </md-list-item>
                    
                        <md-list-item>
                            <md-icon>event_available</md-icon>
                            <span class="md-list-item-text">Finalizadas </span>
                            <md-badge class="md-primary" md-content="4" />
                        </md-list-item>
                    </md-list>
                </md-card-content>

                <md-card-actions>
                    <div class="md-layout md-gutter init">
                        <div class="md-layout-item">
                            <md-button class="md-primary">Ver Mas</md-button>
                        </div>
                        <div class="md-layout-item">
                            <md-button class="md-primary">Invertir</md-button>
                        </div>
                    </div>
                </md-card-actions>
            </md-card>
        </div>
        <div class="md-layout-item md-size-33">
            <md-card class="md-card-example">
                <md-card-area md-inset>
                    <md-card-media md-ratio="16:9">
                        <img src="http://gestaoenegocios.digisa.com.br/upload/imagens_upload/Os_benefcios_do_remarketing.jpg" alt="Coffee House">
                    </md-card-media>

                    <md-card-header>
                        <h5 class="md-title">Tus numeros</h5>
                    </md-card-header>
                </md-card-area>

                <md-card-content>
                    <md-list class="md-dense">
                        <md-list-item>
                            <md-icon>attach_money</md-icon>
                            <span class="md-list-item-text">14.000 Total invertido</span>
                        </md-list-item>
                    
                        <md-list-item>
                            <md-icon>attach_money</md-icon>
                            <span class="md-list-item-text">3.567,45 Rendimiento generado</span>
                        </md-list-item>
                    
                        <!--<md-list-item>
                            <md-icon>attach_money</md-icon>
                            <span class="md-list-item-text">Finalizadas </span>
                        </md-list-item>-->
                    </md-list>
                </md-card-content>

                <md-card-actions>
                    <div class="md-layout md-gutter init">
                        <div class="md-layout-item">
                            <md-button class="md-primary">Ver Mas</md-button>
                        </div>
                    </div>
                </md-card-actions>
            </md-card>
        </div>
        <div class="md-layout-item md-size-33">
            <md-card class="md-card-example">
                <md-card-area md-inset>
                    <md-card-media md-ratio="16:9">
                        <img src="https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/612936/580/386/m1/fpnw/wm0/businessmans-.jpg?1439977225&s=4d520a8ebc389fc82569de0d5794441e" alt="Coffee House">
                    </md-card-media>

                    <md-card-header>
                        <h5 class="md-title">Sociedad</h5>
                    </md-card-header>
                </md-card-area>

                <md-card-content>
                    <md-list class="md-dense">
                        <md-list-item>
                            <md-icon>thumbs_up_down</md-icon>
                            <span class="md-list-item-text">Aun no eres socio nuestro, si estas interesado solicitanos se parte de nosotros!.</span>
                        </md-list-item>
                
                    </md-list>
                </md-card-content>

                <md-card-actions>
                    <div class="md-layout md-gutter init">
                        <div class="md-layout-item">
                            <md-button class="md-primary">Ver Mas</md-button>
                        </div>
                    </div>
                </md-card-actions>
            </md-card>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    //import Chartist from 'chartist';

    export default {
        /**
         * Chart data used to render stats, charts. Should be replaced with server data
         */

        methods: {

            associate() {
                let url = "http://127.0.0.1:90/api/v0/asociaciones"

                axios({
                    method: 'post',
                    url: `${url}`,
                    data: null,
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                }).then(
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
    };
</script>

<style>
.init .md-card-media+.md-card-header {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

.init .md-card-header:last-child {
    margin-bottom: 0px !important;
}

.init .md-card .md-title {
    font-size: 20px !important;
    text-align: center !important;
}

.init .md-card .md-title span{
    background-color: #41b883;
    border-radius: 50%;
    color: white;
    padding: 4px;
    font-size: 20px;
}

.init .md-card-content {
    padding: 0px 16px !important;
    font-size: 14px;
}

.init .md-list-item-text {
    white-space: pre-wrap !important;
}

</style>