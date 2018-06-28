// LAYOUTS-----
import Dashboard from "@/views/layouts/Dashboard.vue";

// GENERALS-----
import Login from "@/views/pages/Login.vue";
import SingUp from "@/views/pages/SingUp.vue";
import NotFound from "@/views/pages/NotFound.vue";

// USERS PAGES-----
import CustomerInit from "@/views/pages/customer/Init.vue";
import CustomerProfile from "@/views/pages/customer/Profile.vue";
import CustomerNotifications from "@/views/pages/customer/Notifications.vue";
import CustomerIcons from "@/views/pages/customer/Icons.vue";
import CustomerInvestments from "@/views/pages/customer/Investments.vue";
import CustomerInvestmentsNew from "@/views/pages/customer/InvestmentsNew.vue";
import CustomerTypography from "@/views/pages/customer/Typography.vue";

// ADMIN PAGES-----
import AdminInit from "@/views/pages/admin/Init.vue";
import AdminProfile from "@/views/pages/admin/Profile.vue";
import AdminPlans from "@/views/pages/admin/Plans.vue";
import AdminUsers from "@/views/pages/admin/users.vue";
import AdminTableList from "@/views/pages/admin/TableList.vue";
import AdminAsociated from  "@/views/pages/admin/Asociated.vue";
import AdminAsociatedList from "@/views/pages/admin/Asociated/AsociatedList.vue"
import AdminAsociatedAprobation from "@/views/pages/admin/Asociated/AsociatedAprobation.vue"


// GUARDS-----
import checkLoginAuth from '@/_guards/CheckLoginAuth.guard.js';
import auth from '@/_guards/Auth.guard.js';

const routes = [{
  path: "/",
  component: Dashboard,
  redirect: "home",
  beforeEnter: auth([3]),

  children: [{
    path: "home",
    name: "CustomerInit",
    component: CustomerInit,

  },{
    path: "profile",
    name: "CustomerProfile",
    component: CustomerProfile

  },{
    path: "icons",
    name: "CustomerIcons",
    component: CustomerIcons

  },{
    path: "investments",
    name: "CustomerInvestments",
    component: CustomerInvestments
  },{
    path: "typography",
    name: "CustomerTypography",
    component: CustomerTypography

  }]

},{
  path: "/admin",
  component: Dashboard,
  redirect: "admin/home",
  beforeEnter: auth([1,2]),

  children: [{
    path: "home",
    component: AdminInit,
    name: "AdminInit",

  },{
    path: "perfil",
    component: AdminProfile,
    name: "AdminProfile"

  },{
    path: "movimientos",
    component: AdminTableList,
    name: "AdminMoves"

  },{
    path: "usuarios",
    component: AdminUsers,
    name: "AdminUsers"

  },{
    path: "asociated",
    component: AdminAsociated,
    name: "AdminAsociated"

  },{
      path: "asociated/List",
      component: AdminAsociatedList,
      name: "AdminAsociatedList"
  },{
    path: "asociated/aprobation",
    component: AdminAsociatedAprobation,
    name: "AdminAsociatedAprobation"
},{
    path: "planes",
    component: AdminPlans,
    name: "AdminPlans"

  }]
},{
  path: "/login",
  component: Login,
  name: "Login",
  beforeEnter: checkLoginAuth()

},{
  path: "/sign-up",
  component: SingUp,
  name: "SignUp"

},{ 
  path: "*", 
  component: NotFound, 
  name:"NotFound"

}];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
