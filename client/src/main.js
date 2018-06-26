import Vue from "vue";
import App from "./App";
import router from "./router/index";


import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

//componentes externos a la plantilla 
import vSelect from 'vue-select/src/components/Select';
import VModal from 'vue-js-modal';
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import 'material-design-icons/iconfont/material-icons.css';
import "@/assets/css/fontawesome.min.css";
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' // This line here
import VuePreload from 'vue-preload'


Vue.use(VuePreload)
// with options
Vue.use(VuePreload, {
  // show the native progress bar
  // put <preloading></preloading> in your root component
  showProgress: true,
  // excutes when click
  onStart() {},
  // excutes when use .end() and after .setState()
  onEnd() {},
  // excutes when prefetching the state
  onPreLoading() {},
})

Vue.use(VueMaterial)

const dictionary = {
  custom: {
    u: {
      required: 'El usuario es requerido'
    },
    password: {
      required: 'El password es requerido'
    }
  }
};
 
Vue.use(PaperDashboard);
// instanciando componentes externos a la plantilla
Validator.localize('custom',dictionary);
Vue.component('v-select', vSelect);
Vue.use(VModal);
Vue.use(VeeValidate, {events: ''});


/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
