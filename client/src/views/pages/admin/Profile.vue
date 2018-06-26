<template>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-6">
        
        <user-card></user-card>

      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        
        <edit-form></edit-form>
      
      </div>
      
    </div>
</template>
<script>
import EditForm from "./Profile/EditForm.vue";
import UserCard from "./Profile/UserCard.vue";
import VueJWT from 'vuejs-jwt';
export default {
  components: {
    EditForm,
    UserCard
  }
};
</script>
<style>
</style>
