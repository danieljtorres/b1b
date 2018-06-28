<template>
<div>
    <md-table v-model="to_be_approved" class="md-layout" md-sort="email" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Aprobar Asociaciones</h1>
        </div>

      </md-table-toolbar>

      <md-table-empty-state
        md-label="No users found"
        :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`">
        <!-- <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button> -->
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Fecha" md-sort-by="fecha">{{ item.creado }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item._usuario.email }}</md-table-cell>
        <md-table-cell md-label="status" md-sort-by="status"> 
              <md-button
                    @click="approvalRequest(item.id)"
                    class="md-primary md-raised"
                    >aprobar</md-button>

        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
  <!--  <div class="md-layout md-gutter">
        <div class="md-layout-item">
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
      </div> -->
</template>


<script>
   const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item._usuario.email).includes(toLower(term)))
    }

    return items;
  }
import axios from "axios";
import VueJWT from 'vuejs-jwt';
import AsociatedService from "@/_services/Asociated.service";
  export default {

  data() {
        return {
            to_be_approved:'' ,
            search: null,
            searched: []
        };
    }, 
     searchOnTable () { 
        this.to_be_approved = searchByName(this.to_be_approved, this.search);

      },
  
  
      created() {
           this.asociatedRequests();
           
       
   


    },
    methods: {
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

  }
  
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>
