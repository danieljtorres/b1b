<template>
<div>

    <!--Stats cards-->
    <div class="row">

        <!-- Card group -->
        <div class="card-group">

            <!-- Card -->
            <div class="card mb-4">

                <!-- Card image -->

                <!-- Card content -->
                <div class="card-body">

                    <!-- Title -->
                    <h4 class="card-title">ser asociado</h4>
                    <!-- Text -->
                    <p class="card-text">Texto explicativo.</p>
                    <!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
                    <button
                        type="button"
                        v-on:click="associate"
                        class="btn btn-primary btn-md"
                    >solicitar</button>

                </div>
                <!-- Card content -->

            </div>
            <!-- Card -->

            <!-- Card -->
            <div class="card mb-4">

                <!-- Card image -->

                <!-- Card content -->
                <div class="card-body">
                    <!-- Title -->
                    <h4 class="card-title">Card title</h4>
                    <!-- Text -->
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
                    <button
                        type="button"
                        class="btn btn-primary btn-md"
                    >Read more</button>

                </div>
                <!-- Card content -->

            </div>
            <!-- Card -->

            <!-- Card -->
            <div class="card mb-4">

                <!-- Card image -->

                <!-- Card content -->
                <div class="card-body">

                    <!-- Title -->
                    <h4 class="card-title">Card title</h4>
                    <!-- Text -->
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
                    <button
                        type="button"
                        class="btn btn-primary btn-md"
                    >Read more</button>

                </div>
                <!-- Card content -->

            </div>
            <!-- Card -->

        </div>
        <!-- Card group -->

    </div>

    <!--Charts-->
  

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
