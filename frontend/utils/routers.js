import LoginPage from "../pages/LoginPage.js";
import CustomerRegistration from "../pages/CustomerRegistration.js";
import ProfessionalRegistration from "../pages/ProfessionalRegistration.js";
import AdminDashboard  from "../pages/AdminDashboard.js";
import ProfessionalDashboard from "../pages/ProfessionalDashboard.js";
import Addservice from "../components/Addservice.js";
import CustomerDashboard from "../pages/CustomerDashboard.js";
import ServiceDetails from "../pages/ServiceDetails.js";
import Homepage from "../pages/Homepage.js";
import ServiceRemark from "../pages/ServiceRemark.js";
import AdminSummary from "../pages/AdminSummary.js";
import CustomerSummary from "../pages/CustomerSummary.js";
import ProfessionalSummary from "../pages/ProfessionalSummary.js";
import CustomerProfile from "../pages/CustomerProfile.js";
import ProfessionalProfile from "../pages/ProfessionalProfile.js";
import AdminSearch from "../pages/AdminSearch.js";
import ProfessionalSearch from "../pages/ProfessionalSearch.js";
import CustomerSearch from "../pages/CustomerSearch.js";

const routes = [
    { path: '/', component: Homepage },
    { path: '/login', component: LoginPage },
    { path: '/customer/registration', component: CustomerRegistration },
    { path: '/professional/registration', component: ProfessionalRegistration },
    {
        path: '/admin/dashboard',
        component: AdminDashboard,
    },
    {
        path: '/professional/:id/dashboard',
        name: 'ProfessionalDashboard',
        component: ProfessionalDashboard,
        props: true
    },
    { path: '/addservice',component: Addservice},
    {
        path: '/customer/:id/dashboard',
        name: 'CustomerDashboard',
        component: CustomerDashboard,
        props: true
    },
    { 
        path: '/service/:id/:customerid', 
        name: 'ServiceDetails', 
        component: ServiceDetails, 
        props: true,
    },
    { 
        path: '/serviceremark/:id', 
        name: 'ServiceRemark', 
        component: ServiceRemark, 
        props: true,
    },
    { path: '/admin/summary', component: AdminSummary },
    {
        path: '/customer/:id/summary',
        name: 'CustomerSummary',
        component: CustomerSummary,
        props: true
    },
    {
        path: '/professional/:id/summary',
        name: 'ProfessionalSummary',
        component: ProfessionalSummary,
        props: true
    },
    {
        path: '/customer/:id/profile',
        name: 'CustomerProfile',
        component: CustomerProfile,
        props: true
    },
    {
        path: '/professional/:id/profile',
        name: 'ProfessionalProfile',
        component: ProfessionalProfile,
        props: true
    },
    { path: '/admin/search', component: AdminSearch },
    {
        path: '/professional/:id/search',
        name: 'ProfessionalSearch',
        component: ProfessionalSearch ,
        props: true
    },
    {
        path: '/customer/:id/search',
        name: 'CustomerSearch',
        component: CustomerSearch ,
        props: true
    },

];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});


export default router;
