<template>
    <div class="container">
        <form autocomplete="false" class="md-layout" @submit.prevent="LogIn">

            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">Login</div>
                </md-card-header>

                <md-card-content>

                    <md-field>
                        <label>Nombre de usuario</label>
                        <md-input v-model="user.usuario" type="text" name="u" v-validate="'required'"></md-input>
                    </md-field>
                    <span class="text-danger align-middle">
                        <i v-show="errors.has('u')" class="fa fa-close"></i>
                        <span>{{ errors.first('u') }}</span>
                    </span>
            
                    <md-field>
                        <label>Contraseña</label>
                        <md-input v-model="user.password" type="password" name="password" v-validate="'required'"></md-input>
                    </md-field>
                    <span class="text-danger align-middle">
                        <i v-show="errors.has('password')" class="fa fa-close"></i>
                        <span>{{ errors.first('password') }}</span>
                    </span>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-50">
                            <md-button type="submit" class="md-raised md-primary"><i class="fa fa-sign-in"></i>Acceder</md-button>
                        </div>

                        <div class="md-layout-item md-small-size-50">
                            <md-button type="button" class="md-primary btn btn-link" href="/password/reset">Olvido su Contraseña?</md-button>
                        </div>
                    </div>
                </md-card-content>

            </md-card>
        </form>
    </div>
</template>


<style>

.md-card {
    margin: auto !important;
    margin-top: 10% !important;
}

.md-card-actions {
    display: flex;
    flex-flow: column;
}
</style>




<script>
import authService from "../../_services/Auth.service";

import NotificationSuccess from "../notifications/LoginSuccess";
import NotificationError from "../notifications/LoginError";

export default {
    data() {
        return {
            type: ["", "info", "success", "warning", "danger"],
            notifications: {
                topCenter: false
            },
            datos: "",
            error: [],
            user: {
                usuario: "",
                password: ""
            }
        };
    },
    methods: {
        LogIn() {

            this.$validator.validate().then(result => {
                if (!result) {
                    return false;
                }   
              

                authService.logIn(this.user.usuario, this.user.password).then(response => {
                    this.$notify({
                        component: NotificationSuccess,
                        icon: "ti-check",
                        horizontalAlign: "right",
                        verticalAlign: "bottom",
                        type: this.type["success"]
                    });

                        console.log(response);
                    setTimeout(() => {
                        this.$router.push({
                            name: response.to
                        });
                    }, 2500);
                },err =>{console.log(err+"hola")

                    this.$notify({
                        component: NotificationError,
                        icon: "ti-check",
                        horizontalAlign: "right",
                        verticalAlign: "bottom",
                        type: this.type["warning"]
                    });

                });
            });
        }
    }
};
</script>






<style lang="scss">

</style>
