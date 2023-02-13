import { createWebHistory, createRouter } from "vue-router";
import Login from "./pages/login.vue";
import Admin from "./pages/admin.vue"
import User from "./pages/user.vue"
import FitArena from "./pages/fitArena.vue"
import Client from "./pages/client.vue"

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/",
        name: "Admin",
        component: Admin,
    },
    {
        path: "/users",
        name: "Users",
        component: User,
    },
    {
        path: "/fitarena",
        name: "FitArena",
        component: FitArena,
    },
    {
        path: "/client",
        name: "Client",
        component: Client,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from ) => {
    if (!localStorage.getItem('token') && to.name !== 'Login') {
        await router.push('/login')
    }
})

export default router;
