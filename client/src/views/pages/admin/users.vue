<template>
<div class="container">


         <md-tabs class="md-gutter">
            <md-tab
                id="tab-home"
                class="md-layout"
                md-label="Aprobar Usuarios"
                md-icon="note_add"
            >
         <div class="card col-12">
           
            <div class="card-header">
                <h4 class="card-title">Usuarios de la plataforma</h4>
                <p class="card-category">aqui se activan los usuarios</p>
            </div>
           
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>QR</th>
                        <th>Codigo</th>
                        <th>estatus</th>

                    </thead>
                    <tbody v-for="user in users">
                        <tr>
                            <td>
                                {{user.usuario}}
                            </td>
                            <td>
                                {{user.email}}
                            </td>
                            <td>
                                {{user.qr}}
                            </td>
                            <td>
                                {{user.codigo}}
                            </td>
                            <td v-if="user.activo==1">
                                <button class="btn btn-warning">desactivar</button>
                            </td>
                            <td v-else="">
                                <button class="btn btn-primary">Habilitar</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
           
        </div> 


        </md-tab>

    <md-tab 
                    id="tab-pages"
                    md-label="Usuarios Por aprobar"
                    md-icon="pages"
                > 
    <div class="card col-12">

        <div class="card-header">
            <h4 class="card-title">Asociaciones pendientes</h4>
            <p class="card-category">aprobar solicitudes de asociacion</p>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <th>Usuario</th>
                    <th>Email</th>

                    <th>estatus</th>

                </thead>
                <tbody v-for="requested in to_be_approved">
                    <tr>
                        <td>
                            {{requested.creado}}
                        </td>
                        <td>
                            {{requested._usuario.email}}
                        </td>
                        <td>
                            <button
                                @click="approvalRequest(requested.id)"
                                class="btn btn-primary"
                            >aprobar</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    </div>
     </md-tab>
 </md-tabs>
    </div>

   
</template>



<script>
import axios from "axios";
import VueJWT from 'vuejs-jwt';
import AsociatedService from "@/_services/Asociated.service";
import UserService from "@/_services/User.service";

export default {
    data() {
        return {
            to_be_approved:'' ,
            users: ""
        };
    },

    created() {

        this.asociatedRequests();
        this.getClientList();


    },

    methods: {
        getClientList(){
        
        UserService.getClients().then(response =>{

            this.users = response.data.data;
            console.log(response);

        }, err => {
                console.log(err);
            });
        },
        
        
        asociatedRequests() {
            AsociatedService.associatesList().then(response => {

                this.to_be_approved = response.data.data;

                console.log(response);

            }, err => {
                console.log(err);
            });
        },
      
        approvalRequest(id) {
            AsociatedService.associatesApproval(id).then(response => {
                console.log(response);
            }, err => {
                console.log(err);
            });
        }
    }

};
</script>



<style>

</style>
