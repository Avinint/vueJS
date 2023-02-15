import { createWebHistory, createRouter } from "vue-router";
import Login from "./pages/login.vue";
import Admin from "./pages/admin.vue"
import User from "./pages/user.vue"
import FitArena from "./pages/fitArena.vue"
import Client from "./pages/client.vue"
import { useUserStore } from "./stores/user.js";

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
        path: "/clients",
        name: "Clients",
        component: Client,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from ) => {
    const user = useUserStore()
    if (!user.connected && to.name !== 'Login')
        await router.push('/login')
})

export default router;
