<template>
<div >
    <form novalidate class="md-layout md-gutter md-alignment-top-center" @submit.prevent="CreateAcount">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">Crear Cuenta</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="first-name">Nombres</label>
                <md-input v-model="user.nombres" name="first-name" id="first-name" />
                
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="last-name">Apellidos</label>
                <md-input v-model="user.apellidos" name="last-name" id="last-name" />
              
              </md-field>
            </div>
          </div>

      
     <div class="md-layout md-gutter">
           <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="dni">DNI</label>
                <md-input v-model="user.dni" type="number" id="dni" name="dni"  />
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
            <md-field>
            <label for="email">Email</label>
            <md-input v-model="user.email" type="email" name="email" id="email"/>
           
          </md-field>
            </div>
          </div>
   <div class="md-layout md-gutter">
                
                <div class="md-layout-item md-small-size-100">
              <md-field>
                        <label>Nombre de usuario</label>
                        <md-input v-model="user.usuario" type="text" name="u" v-validate="'required'"></md-input>
                    </md-field>
                    <span class="text-danger align-middle">
                        <i v-show="errors.has('u')" class="fa fa-close"></i>
                        <span>{{ errors.first('u') }}</span>
                    </span>
                </div>

                 <div class="md-layout-item md-small-size-100">
                    <md-field>
                        <label>Contraseña</label>
                        <md-input v-model="user.password" type="password" name="password" v-validate="'required'"></md-input>
                    </md-field>
                    <span class="text-danger align-middle">
                        <i v-show="errors.has('password')" class="fa fa-close"></i>
                        <span>{{ errors.first('password') }}</span>
                    </span>
                 </div>


   </div>

             <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="phone">Telefono</label>
                <md-input v-model="user.telefono" type="number" id="phone" name="phone"   />
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field >
             <md-select v-if="countries.length > 0" v-model="user.pais_id">
                  <md-option>Elegir</md-option>
                  <md-option v-for="country in countries" :key="country.id" :value="country.id">{{country.nombre}}</md-option>
                 
                </md-select>
                </md-field >
            </div>

          
          </div>

        <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="city">Ciudad</label>
                <md-input v-model="user.ciudad" name="city" id="city"   />
                
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="address">Dirección</label>
                <md-input v-model="user.direccion" name="address" id="address" />
              
              </md-field>
            </div>
          </div>
        </md-card-content>

        

        <md-card-actions>
          <md-button type="submit" class="md-primary">Crear Cuenta</md-button>
        </md-card-actions>
      </md-card>


    </form>
  </div>
</template>


  <style>
body {
  background-color: #f4f3ef;
}


</style>
  

<script>
import axios from "axios";

import SignUpSuccess from "../notifications/SignUpSuccess";
import countryService from '@/_services/Country.service';
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
        password: "",
        dni:"",
        ciudad:"",
        direccion:""
      },
       countries: []
    };
  },
  created() {
    this.getCountries();
  },

  methods: {
      getCountries() {
      countryService.getAll().then(response => {

        this.countries = response.data.data;

      },err => {
        console.log(err);
      })
    },
   
    CreateAcount() {
          
      axios
        .post(`http://127.0.0.1:90/api/v0/clientes/`, {
          pais_id: this.user.pais_id,
          nombres: this.user.nombres,
          apellidos: this.user.apellidos,
          telefono: this.user.telefono,
          usuario: this.user.usuario,
          email: this.user.email,
          password: this.user.password,
          dni: this.user.dni,
          ciudad:this.user.ciudad,
          direccion: this.user.direccion,
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