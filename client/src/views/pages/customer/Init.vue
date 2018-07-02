<template>
    <div class="md-layout md-gutter">
        <div class="md-layout-item">1</div>
        <!--<div class="md-layout-item">2</div>
        <div class="md-layout-item">3</div>-->
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

</style>
