
<template>

  <div class="wrapper">

    <side-bar v-if="showByRol([3])">

      <template slot="links">
        <sidebar-link to="/home" name="INICIO" icon="home"/>
        <sidebar-link to="/profile" name="MI PERFIL" icon="account_box"/>
        <sidebar-link to="/investments" name="Mis Inversiones" icon="book"/>
        <sidebar-link to="/icons" name="USTOMER ICONS" icon="book"/>
  
      </template>

      <mobile-menu>
        <li class="divider"></li>
      </mobile-menu>
      
    </side-bar>

    <side-bar v-if="showByRol([1,2])">

      <template slot="links">
        <sidebar-link v-if="showByRol([1,2])" to="/admin/home" name="DASHBOARD" icon="dashboard"/>
        <sidebar-link v-if="showByRol([1,2])" to="/admin/perfil" name="MI PERFIL" icon="person"/>
        <sidebar-link v-if="showByRol([1,2])" to="/admin/usuarios" name="USUARIOS" icon="people"/>
        <sidebar-link  v-if="showByRol([1,2])" to="/admin/asociated" name="Asociados" icon="book"/>

        <sidebar-link v-if="showByRol([1,2])" to="/admin/planes" name="PLANES" icon="chrome_reader_mode"/>
        <sidebar-link v-if="showByRol([1,2])" to="/admin/movimientos" name="ADMIN MOVES" icon="library_books"/>
      </template>

      <mobile-menu>
        <li class="divider"></li>
      </mobile-menu>

    </side-bar>

    <div class="main-panel">

      <top-navbar-customer v-if="showByRol([3])"></top-navbar-customer>
      <top-navbar-admin v-if="showByRol([1,2])"></top-navbar-admin>

      <content-dash @click.native="toggleSidebar"></content-dash>

      <content-footer></content-footer>
    
    </div>
  
  </div>

</template>

<script>

import authService from "../../_services/Auth.service";

import TopNavbarCustomer from "./customer/TopNavbar.vue";
import TopNavbarAdmin from "./admin/TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import ContentDash from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbarCustomer,
    TopNavbarAdmin,
    ContentFooter,
    ContentDash,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },

    showByRol(rols = []) {
      return rols.indexOf(authService.data().rol) != -1;
    }
  }
};

</script>

<style lang="scss">
</style>