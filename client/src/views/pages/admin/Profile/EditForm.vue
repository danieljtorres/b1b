<template>
  <card class="card col-12 center" style="margin:auto;" title="Cree Su Cuenta">
    <div class="container">
             <modal name="hello-world">
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
     
    </div>
    
  </card>
   
</template>

<script>

import authService from "@/_services/Auth.service";

//import NotificationTemplate from "../Notifications/NotificationTemplate";

export default {
  data() {
    return {
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
    show() {
      this.$modal.show("hello-world");
    },
    hide() {
      this.$modal.hide("hello-world");
    },

    updateProfile() {
      authService.edit(this.user).then(response => {
        /*this.$notify({
          component: NotificationTemplate,
          icon: "ti-check",
          horizontalAlign: "right",
          verticalAlign: "bottom",
          type: "success"
        });*/
      },err => {
        console.log(err);
      });
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
