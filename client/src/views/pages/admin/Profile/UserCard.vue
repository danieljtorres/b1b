<template>

    <md-card class="mt-0" md-with-hover>
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="1:1">
        <label class="avatar" for="avatar" v-bind:style="{ backgroundImage: 'url('+av+')' }">
        </label>
        </md-card-media>

        <md-card-area>
    
          <md-card-actions>
          
          <input type="file"  id="avatar" name="avatar" :disabled="uploading" @change="changeAvatar($event.target.files);" accept="image/*">
                  <label for="avatar">
          <md-icon style="color: white !important; cursor: pointer;">edit</md-icon>
         
        </label>
        <div class="md-title">{{nombres}} {{apellidos}}</div>
         <a href="#">
            <small>@{{usuario}}</small>
          </a>
          </md-card-actions>
        </md-card-area>
      </md-card-media-cover>
    </md-card>

</template>

<script>

import authService from "@/_services/Auth.service";

export default {
  props:['avatar', 'usuario', 'nombres', 'apellidos'],
  data() {
    return {
      uploading: false,
      av: this.avatar
    }
  },
  watch: {
    avatar: function(now, old) {
      this.avatar = now;
    },
    usuario: function(now, old) {
      this.usuario = now;
    },
    nombres: function(now, old) {
      this.nombres = now;
    },
    apellidos: function(now, old) {
      this.apellidos = now;
    }
  },
  methods: {
    changeAvatar(files) {
      const formData = new FormData();

      if (!files.length) return;

      formData.append('avatar', files[0], files[0].name);

      authService.changeAvatar(formData).then(response => {
        this.$notify({
          title: "Sus avatar ha sido actualizado con exito!",
          type: "success"
        });

        this.av = response;
      }, err => {
        console.log(err)
      })
    }
  }
};
</script>
<style>
 input[type="file"] {
  visibility: hidden;height: 0;
} 

.card-user .author {
    margin-top: 0px !important;
}
label.avatar {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    margin-bottom: 0;
    cursor: pointer;
}
</style>
