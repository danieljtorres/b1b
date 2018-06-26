import Vue from "vue";
import VueRouter from "vue-router";
import VueJWT from 'vuejs-jwt';
import routes from "./routes";

Vue.use(VueRouter);

Vue.use(VueJWT);
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "active"
});

export default router;