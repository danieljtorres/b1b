<template>

    <div>
       <modal name="change-password">
      <div class="box">
        <div class="box-part" id="bp-left">
          <div class="partition" id="partition-register">
            <div class="partition-title">Cambiar Contraseña</div>
            <div class="partition-form">
              <form autocomplete="false">
                <input id="n-password1" type="password" placeholder="Password">
                <input id="n-password2" type="password" placeholder="Password">
              </form>
              <div class="button-set">
                <button id="goto-signin-btn">Confirmar</button>
              </div>

            </div>
          </div>
        </div>
      
      </div>
    </modal> 
    <form  class="md-layout" @submit.prevent>
      <md-card style="    margin-top: 0 !important;" md-with-hover class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">Mis datos</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="first-name">nombres</label>
                <md-input  v-model="user.nombres" />
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="last-name">Apellidos</label>
                <md-input v-model="user.apellidos"  />
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label >País</label>
                <md-select v-if="countries.length > 0" v-model="user.pais_id">
                  <md-option>Elegir</md-option>
                  <md-option v-for="country in countries" :key="country.id" :value="country.id">{{country.nombre}}</md-option>
                 
                </md-select>
              
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="age">Telefono</label>
                <md-input type="number" v-model="user.telefono" />
              </md-field>
            </div>
          </div>

          <md-field>
            <label for="email">Email</label>
            <md-input type="email" v-model="user.email"/>
          </md-field>
        </md-card-content>


        <md-card-actions>
          <md-button type="submit" @click.native.prevent="updateProfile"  class="md-primary"  >Actualizar</md-button>
          <md-button @click.native.prevent="show"  class="md-primary"> cambiar clave </md-button>
         </md-card-actions>
      </md-card>

    </form>
  </div>
   <!-- @click.native.prevent="updateProfile" 
     <select class="form-control" v-if="countries.length > 0">
              <option v-for="country in countries" :value="country.id" :selected="country.id == user.pais_id">{{country.nombre}}</option>
            </select>
   -->
</template>

<script>

import authService from '@/_services/Auth.service';
import countryService from '@/_services/Country.service';

//import EditProfileSuccess from "../Notifications/NotificationTemplate";

export default {
  props: ['userData'],
  data () {
    return {
      user: {
        pais_id: this.userData.pais_id,
        nombres: this.userData.nombres,
        apellidos: this.userData.apellidos,
        telefono: this.userData.telefono,
        usuario: this.userData.usuario,
        email: this.userData.email,
      },
      countries: [],
      c: ['foo', 'bar', 'baz'],
    }
  },
  beforecreate(){  },
  created() {
    this.getCountries();
  },

  methods: {
   
    show() {
      this.$modal.show("change-password");
    },
    hide() {
      this.$modal.hide("change-password");
    },

    updateProfile() {
      authService.edit(this.user).then(response => {

        this.$notify({
          title: "Sus datos se han actualizado con exito!",
          type: "success"
        });

        this.$emit('updated', this.user);
      },err => {
        console.log(err);
      });
    },

    getCountries() {
      countryService.getAll().then(response => {

        this.countries = response.data.data;

      },err => {
        console.log(err);
      })
    }
  }
};
</script>

<style lang="scss">
$background_color: #404142;
$github_color: #dba226;
$facebook_color: #3880ff;

.box {
  background: white;
  overflow: hidden;
  width: 656px;
  height: 400px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 0 40px black;
  color: #8b8c8d;
  font-size: 0;

  .box-part {
    display: inline-block;
    position: relative;
    vertical-align: top;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
  }

  .box-messages {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .box-error-message {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    height: 0;
    line-height: 32px;
    padding: 0 12px;
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: white;
    background: #f38181;
  }

  .partition {
    width: 100%;
    height: 100%;

    .partition-title {
      box-sizing: border-box;
      padding: 30px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      font-size: 20px;
      font-weight: 300;
    }

    .partition-form {
      padding: 0 20px;
      box-sizing: border-box;
    }
  }

  input[type="password"],
  input[type="text"] {
    display: block;
    box-sizing: border-box;
    margin-bottom: 4px;
    width: 100%;
    font-size: 12px;
    line-height: 2;
    border: 0;
    border-bottom: 1px solid #dddedf;
    padding: 4px 8px;
    font-family: inherit;
    transition: 0.5s all;
    outline: none;
  }

  button {
    background: white;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px;
    letter-spacing: 1px;
    font-family: "Open Sans", sans-serif;
    font-weight: 400;
    min-width: 140px;
    margin-top: 8px;
    color: #8b8c8d;
    cursor: pointer;
    border: 1px solid #dddedf;
    text-transform: uppercase;
    transition: 0.1s all;
    font-size: 10px;
    outline: none;
    &:hover {
      border-color: mix(#dddedf, black, 90%);
      color: mix(#8b8c8d, black, 80%);
    }
  }

  .large-btn {
    width: 100%;
    background: white;

    span {
      font-weight: 600;
    }
    &:hover {
      color: white !important;
    }
  }

  .button-set {
    margin-bottom: 8px;
  }

  #register-btn,
  #signin-btn {
    margin-left: 8px;
  }

  .autocomplete-fix {
    position: absolute;
    visibility: hidden;
    overflow: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
  }
}

.pop-out-enter-active,
.pop-out-leave-active {
  transition: all 0.5s;
}

.pop-out-enter,
.pop-out-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
</style>