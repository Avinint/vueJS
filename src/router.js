import { createWebHistory, createRouter } from 'vue-router'
import { useUserStore } from './stores/user.js'

import Login from './pages/login.vue'
import Admin from './pages/admin.vue'
import User from './pages/user.vue'
import ClientUsers from './pages/ClientUser.vue'
import FitArena from './pages/fitArena.vue'
import FitArenas from './pages/fitArenas.vue'
import Client from './pages/client.vue'
import FaParams from './pages/fitarena/FaParams.vue'
import FaConfig from './pages/fitarena/FaConfig.vue'
import FaSpaces from './pages/fitarena/FaSpaces.vue'
import FaWeb from './pages/fitarena/FaWeb.vue'
import FaSubSpaces from './pages/fitarena/FaSubSpaces.vue'
import FaActualities from './pages/fitarena/FaActualities.vue'
import FaSupervision from './pages/fitarena/FaSupervision.vue'
import FaZones from './pages/fitarena/FaZones.vue'
import FaActivitiesByZone from './pages/fitarena/FaActivitiesByZone.vue'
import FaActivities from './pages/fitarena/FaActivities.vue'
import FaNumericEquipements from './pages/fitarena/FaNumericEquipements.vue'
import FaMotorEquipements from './pages/fitarena/FaMotorEquipements.vue'
import FaPlanning from './pages/fitarena/FaPlanning.vue'
import FaOrganisme from './pages/FaOrganisme.vue'
import OgPlanning from './pages/organisme/OgPlanning.vue'
import Animateur from '@pages/animateur.vue'
import Adherent from '@pages/Adherent.vue'
import AdherentGroupe from "@pages/AdherentGroupe.vue"
import FaReservations from "@pages/fitarena/FaReservations.vue"
import FaDemandes from "@pages/fitarena/FaDemandes.vue"
import FaTarifs from "@pages/fitarena/FaTarifs.vue"
import Preferences from "@pages/fitarena/Preferences.vue"

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/users',
    name: 'Users',
    component: User,
    meta: {
      breadcrumbs: [
        {
          link: '',
          label: 'Utilisateurs'
        }
      ]
    }
  },
  {
    path: '/fitarena',
    name: 'FitArenas',
    component: FitArenas,
    meta: {
      breadcrumbs: [
        {
          link: '',
          label: 'Fit Arena'
        }
      ]
    }
  },
  {
    path: '/fitarena/:id',
    props: true,
    name: 'FitArena',
    component: FitArena,
    children: [
      {
        path: 'config',
        component: FaConfig,
        meta: {
          breadcrumbs: [
            {
              label: 'Configuration',
              link: ''
            }
          ]
        }
      },
      {
        path: 'planning',
        component: FaPlanning,
        meta: {
          breadcrumbs: [
            {
              label: 'Planning',
              link: '',
            }
          ]
        }
      },
      {
        path: 'reservations',
        component: FaReservations,
        meta: {
          breadcrumbs: [
            {
              label: 'Réservations',
              link: ''
            }
          ]
        }
      },
      {
        path: 'params',
        component: FaParams,
        meta: {
          breadcrumbs: [
            {
              label: 'Paramètres',
              link: ''
            }
          ]
        }
      },
      {
        path: 'espaces',
        component: FaSpaces,
        meta: {
          breadcrumbs: [
            {
              label: 'Espaces',
              link: ''
            }
          ]
        }
      },
      {
        path: 'actualities',
        component: FaActualities,
        meta: {
          breadcrumbs: [
            {
              label: 'Actualités',
              link: ''
            }
          ]
        }
      },
      {
        path: 'web',
        component: FaWeb,
        meta: {
          breadcrumbs: [
            {
              label: 'Web',
              link: ''
            }
          ]
        }
      },
      {
        path: 'zones',
        component: FaZones,
        meta: {
          breadcrumbs: [
            {
              label: 'Zones',
              link: ''
            }
          ]
        }
      },
      {
        path: 'sous-espaces',
        component: FaSubSpaces,
        meta: {
          breadcrumbs: [
            {
              label: 'Sous-espaces',
              link: ''
            }
          ]
        }
      },
      {
        path: 'activites-par-zone',
        component: FaActivitiesByZone,
        meta: {
          breadcrumbs: [
            {
              label: 'Activités par zones',
              link: ''
            }
          ]
        }
      },
      {
        path: 'activites',
        component: FaActivities,
        meta: {
          breadcrumbs: [
            {
              label: 'Activités',
              link: ''
            }
          ]
        }
      },
      {
        path: 'equipements-numeriques',
        component: FaNumericEquipements,
        meta: {
          breadcrumbs: [
            {
              label: 'Équipements numériques',
              link: ''
            }
          ]
        }
      },
      {
        path: 'equipements-motorises',
        component: FaMotorEquipements,
        meta: {
          breadcrumbs: [
            {
              label: 'Équipements motorisés',
              link: '',
            }
          ]
        }
      },
      {
        path: 'supervision',
        component: FaSupervision,
        meta: {
          breadcrumbs: [
            {
              label: 'Supervision',
              link: ''
            }
          ]
        }
      },
      {
        path: 'demandes',
        component: FaDemandes,
        meta: {
          breadcrumbs: [
            {
              label: 'Demandes',
              link: ''
            }
          ]
        }
      },
      {
        path: 'tarifs',
        component: FaTarifs,
        meta: {
          breadcrumbs: [
            {
              label: 'Tarifs',
              link: ''
            }
          ]
        }
      }
    ]
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Client,
    meta: {
      breadcrumbs: [
        {
          link: '',
          label: 'Clients'
        }
      ]
    }
  },
  {
    path: '/animateurs',
    name: 'animateurs_global',
    component: Animateur,
    meta: {
      breadcrumbs: [
        {
          label: 'Animateur',
          link: ''
        },
        {
          label: 'Liste',
          link: ''
        }
      ]
    }
  },
  {
    path: '/organismes',
    name: 'organismes',
    component: FaOrganisme,
    meta: {
      breadcrumbs: [
        {
          link: '',
          label: 'Organismes'
        }
      ]
    }
  },
  {
    path: '/organismes/:org_id',
    props: true,
    name: 'Organismes',
    component: FitArena,
    meta: {
      breadcrumbs: []
    },
    children: [
      {
        path: 'planning/:id',
        component: OgPlanning,
        meta: {
          breadcrumbs: [
            {
              label: 'Planning',
              link: ''
            }
          ]
        }
      }
    ]
  },
  {
    path: '/clients/:id/users',
    props: true,
    name: 'utilisateurs_par_client',
    component: ClientUsers,
    meta: {
      breadcrumbs: [
        {
          label: 'Utilisateurs',
          link: ''
        },
        {
          label: 'Liste',
          link: ''
        }
      ]
    }
  },
  {
    path: '/clients/:id/organismes',
    props: true,
    name: 'organismes_par_client',
    component: FaOrganisme,
    meta: {
      breadcrumbs: [
        {
          label: 'Organismes',
          link: ''
        },
        {
          label: 'Liste',
          link: ''
        },
      ]
    }
  },
  {
    path: '/organismes/:id/animateurs',
    name: 'animateursParOrganisme',
    component: Animateur,
    meta: {
      breadcrumbs: [
        // {
        //   label: 'Animateur',
        //   link: 'animateur'
        // },
        // {
        //   label: 'Liste',
        //   link: 'liste'
        // }
      ]
    }
  },
  {
    path: '/organismes/:id/groupes',
    name: 'groupesParOrganisme',
    component:  AdherentGroupe,
    meta: {
      breadcrumbs: [
        // {
        //   label: 'Animateur',
        //   link: 'animateur'
        // },
        // {
        //   label: 'Liste',
        //   link: 'liste'
        // }
      ]
    }
  },
  {
    path: '/organismes/:id/adherents',
    name: 'groupes',
    component:  Adherent,
    meta: {
      breadcrumbs: [
        // {
        //   label: 'Animateur',
        //   link: 'animateur'
        // },
        // {
        //   label: 'Liste',
        //   link: 'liste'
        // }
      ]
    }
  },
  {
    path: '/preferences-et-confidentialite',
    name: 'preference',
    component: Preferences
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const user = useUserStore()
  if (!user.connected && to.name !== 'Login') await router.push('/login')
})

export default router
