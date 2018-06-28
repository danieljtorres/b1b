<template>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <user-card v-if="loaded" :avatar="avatar" :usuario="user.usuario" :nombres="user.nombres" :apellidos="user.apellidos">
        </user-card>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <edit-form v-if="loaded" :userData="user" @updated="setUser($event)"></edit-form>
      </div>
    </div>
</template>
<script>

import EditForm from "./Profile/EditForm.vue";
import UserCard from "./Profile/UserCard.vue";

import authService from "@/_services/Auth.service";

export default {
  components: {
    EditForm,
    UserCard,
  },

  data () {
    return {
      loaded: false,
      avatar: '',
      user: {
        pais_id: 0,
        nombres: "",
        apellidos: "",
        telefono: "",
        usuario: "",
        email: "",
      } 
    }
  },

  beforeCreate() {
    authService.profile().then(response => {

      let user = response.data.data;

      this.user.pais_id   = user._cliente.pais_id;
      this.user.nombres   = user._cliente.nombres;
      this.user.apellidos = user._cliente.apellidos;
      this.user.telefono  = user._cliente.telefono;
      this.user.usuario   = user.usuario;
      this.user.email     = user.email;

      let isBase64;
      
      try {
          isBase64 = btoa(atob(user.avatar)) == user.avatar;
      } catch (err) {
          isBase64 = false;
      }

      if (isBase64) {
        this.avatar = 'data:image/png;base64,' + user.avatar;
      } else {
        this.avatar = user.avatar;
      }

      this.loaded = true;
      
    }, err => {
      console.log(err);
    })
  },

  methods: {
    setUser(event) {
      this.user.pais_id   = event.pais_id;
      this.user.nombres   = event.nombres;
      this.user.apellidos = event.apellidos;
      this.user.telefono  = event.telefono;
      this.user.usuario   = event.usuario;
      this.user.email     = event.email;
    }
  }

};
</script>

<style>
</style>
