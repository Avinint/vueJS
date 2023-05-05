import { createWebHistory, createRouter } from 'vue-router'
import Login from './pages/login.vue'
import Admin from './pages/admin.vue'
import User from './pages/user.vue'
import FitArena from './pages/fitArena.vue'
import FitArenas from './pages/fitArenas.vue'
import Client from './pages/client.vue'
import FaParams from './pages/fitarena/FaParams.vue'
import FaSpaces from './pages/fitarena/FaSpaces.vue'
import FaWeb from './pages/fitarena/FaWeb.vue'
import FaSubSpaces from './pages/fitarena/FaSubSpaces.vue'
import FaActualities from './pages/fitarena/FaActualities.vue'
import FaZones from './pages/fitarena/FaZones.vue'
import FaActivitiesByZone from './pages/fitarena/FaActivitiesByZone.vue'
import FaActivities from './pages/fitarena/FaActivities.vue'
import FaNumericEquipements from './pages/fitarena/FaNumericEquipements.vue'
import FaMotorEquipements from './pages/fitarena/FaMotorEquipements.vue'
import FaPlanning from './pages/fitarena/FaPlanning.vue'
import FaOrganisme from './pages/fitarena/FaOrganisme.vue'


import { useUserStore } from './stores/user.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Admin',
    component: Admin,
    meta: {
      breadcrumbs: [],
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: User,
    meta: {
      breadcrumbs: [
        {
          link: 'users',
          label: 'Utilisaterus',
        },
      ],
    },
  },
  {
    path: '/fitarena',
    name: 'FitArenas',
    component: FitArenas,
    meta: {
      breadcrumbs: [
        {
          link: '',
          label: 'Fit Arena',
        },
      ],
    },
  },
  {
    path: '/fitarena/:id',
    props: true,
    name: 'FitArena',
    component: FitArena,
    meta: {
      breadcrumbs: [],
    },
    children: [
      {
        path: 'planning',
        component: FaPlanning,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'params',
        component: FaParams,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },

      {
        path: 'espaces',
        component: FaSpaces,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'actualities',
        component: FaActualities,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'web',
        component: FaWeb,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'zones',
        component: FaZones,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'sous-espaces',
        component: FaSubSpaces,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'activites-par-zone',
        component: FaActivitiesByZone,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'activites',
        component: FaActivities,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'equipements-numeriques',
        component: FaNumericEquipements,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'equipements-motorises',
        component: FaMotorEquipements,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
      {
        path: 'organismes',
        component: FaOrganisme,
        meta: {
          breadcrumbs: [
            {
              label: 'Fit Arena',
              link: 'fitarena',
            },
            {
              label: 'Fit Arena - Dijon',
              link: 'fitarena/',
            },
          ],
        },
      },
    ],
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Client,
    meta: {
      breadcrumbs: [
        {
          link: 'clients',
          label: 'Clients',
        },
      ],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const user = useUserStore()
  if (!user.connected && to.name !== 'Login') await router.push('/login')
})

export default router
