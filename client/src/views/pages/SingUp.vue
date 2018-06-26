<template>
  <card class="card col-8 center" style="margin:auto;" title="Cree Su Cuenta">
    <div class="container">
      <form style="margin:auto;" @submit.prevent>
        <div class="row">
          <div class="col-md-5">
            <fg-input type="text"
                      label="País"
                      :disabled="true"
                      placeholder="País"
                      v-model="user.pais_id">
            </fg-input>
          </div>
          <div class="col-md-3">

            <fg-input type="text"
                      label="Nombres"
                      placeholder="Nombres"
                      v-model="user.nombres">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Apellidos"
                      placeholder="Apellidos"
                      v-model="user.apellidos">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input type="number"
                      label="Telefono"
                      placeholder="Numero Telefonico"
                      v-model="user.telefono">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="text"
                      label="Nombre de Usuario"
                      placeholder="Usuario"
                      v-model="user.usuario">
            </fg-input>
          </div>
        </div>

    

        <div class="row">
          <div class="col-md-6">
            <fg-input type="email"
                      label="Email"
                      placeholder="Email"
                      v-model="user.email">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="password"
                      label="Clave"
                      placeholder="Clave"
                      v-model="user.password">
            </fg-input>
          </div>
        
        </div>

       <!--  <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>About Me</label>
              <textarea rows="5" class="form-control border-input"
                        placeholder="Here can be your description"
                        v-model="user.aboutMe">

              </textarea>
            </div>
          </div>
        </div> -->
        <div class="text-center">
          <p-button type="info"
                    round
                    @click.native.prevent="updateProfile">
            Registrarse
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
      <div class="col-md-3">
          
          </div>
    </div>
    
  </card>
   
</template>


  <style>
body {
  background-color: #f4f3ef;
}

.container {
  height: 500px !important;
}
</style>
  

<script>
import axios from "axios";

import SignUpSuccess from "../notifications/SignUpSuccess";

export default {
  data() {
    return {
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },

      user: {
        pais_id: 1,
        nombres: "",
        apellidos: "",
        telefono: "",
        usuario: "",
        email: "",
        password: ""
      }
    };
  },

  methods: {
   
    updateProfile() {
      
      axios
        .post(`http://127.0.0.1:90/api/v0/clientes/`, {
          pais_id: this.user.pais_id,
          nombres: this.user.nombres,
          apellidos: this.user.apellidos,
          telefono: this.user.telefono,
          usuario: this.user.usuario,
          email: this.user.email,
          password: this.user.password,
          rol_id:3
        })
        .then(
          response => {
            //handle success

            this.$notify({
              component: SignUpSuccess,
              icon: "ti-gift",
              horizontalAlign: "right",
              verticalAlign: "bottom",
              type: this.type["success"]
            });

           
            console.log(response);
          },
          err => {
            console.log(err);
            console.log(this.user);
          }
        );

    }
  }
};
</script>
<style>
</style>