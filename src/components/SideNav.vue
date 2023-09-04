<template>
  <div>
    <aside id="logo-sidebar"
           class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-80 h-full font-normal duration-75 lg:flex transition-width"
           aria-label="Sidebar">
      <div class="bg-red-600 h-14 flex items-center">
        <router-link test="Thome" to="/" class="ml-2">
          <img src="../assets/logo.png" class="h-5 ml-10" alt="logo">
        </router-link>
      </div>
      <div class="h-full overflow-y-auto bg-white ">
        <template v-for="(links_by_type, type) in links">
          <div v-for="(link, i) in links_by_type" :key="i" class="flex flex-col items-center text-base font-normal text-gray-900">
            <div class="flex items-center pl-8 pr-1 py-2 w-full"
                 :class="link.divider ? 'text-xl -ml-6 text-red-600' : 'hover:bg-gray-100 -ml-14 text-sm'">
              <ChevronSVG :open="link.open" :visible="link.sub_links !== undefined" @openMenuItem="openSubLinks(link, type)"/>
              <side-nav-item :icon="link.icon ?? ''" :label="link.label" :path="link.path" :tag="link.tag"
                             :id="'T' + link.path">
                <CitySVG v-if="link.icon === 'city'"/>
                <HomeSVG v-if="link.icon === 'home'"/>
              </side-nav-item>
            </div>
            <div class="w-full bg-gray-100">
              <div v-for="(sub_link, sub_i) in link.sub_links" v-if="link.open && link.sub_links.length"
                   class="flex flex-col items-center text-base font-normal text-gray-900">
                <div class="flex items-center pl-8 pr-1 py-2 w-full hover:bg-gray-100 text-sm">
                  <ChevronSVG :open="sub_link.sub_links_open" :visible="sub_link.sub_links !== undefined" @openMenuItem="openSubSubLinks(i, sub_i)"/>
                  <side-nav-item icon="city" :label="sub_link.label" :path="sub_link.path" :tag="sub_link.tag">
                    <CitySVG />
                  </side-nav-item>
                </div>
                <div v-for="sub_sub_link in sub_link.sub_links"
                     v-if=" sub_link.sub_links && sub_link.sub_links_open && sub_link.sub_links.length"
                     class="w-full flex text-left bg-gray-200 items-center pl-12 pr-3 py-2">
                  <side-nav-item :icon="sub_sub_link.icon" :label="sub_sub_link.label" :path="sub_sub_link.path"
                                 :tag="sub_sub_link.tag" class="text-sm truncate"/>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>

    </aside>
  </div>
</template>

<script setup lang="ts">

import SideNavItem from "./SideNavItem.vue"
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue"
import Link from '../types/Link'

import {useUserStore} from "@/stores/user.js";
import HomeSVG from "@components/svg/HomeSVG.vue";
import CitySVG from "@components/svg/CitySVG.vue";
import ChevronSVG from "@components/svg/ChevronSVG.vue";
import {useMenuStore} from "@/stores/menu.js"
const { toggleOrganisme, toggleFitArena, toggleClient, fetchMenu  } = useMenuStore()
const {isAdmin, isGestCo, isGestOrg} = useUserStore();

const openSubLinks = (link, type) => {
  link.open = !link.open
  switch (type) {
    case 'fit_arenas':
      toggleFitArena(link.id, link.open)
      break
    case 'organismes':
      toggleOrganisme(link.id, link.open)
      break
    case 'clients':
     toggleClient(link.id, link.open)
      break
  }
}

/** @note plus utilisé, mais pourrait servir dans le futur */
const openSubSubLinks = (i, sub_i) => {
  let sub_links = links.value[i].sub_links
  sub_links[sub_i].sub_links_open = !sub_links[sub_i].sub_links_open
}
// let links: Link[] = reactive([])

const clientLinks = computed(
  () => useMenuStore().clients.length ?

    [
    {
      label: 'Espace client',
      path: '',
      divider: true,
    },

    ...isAdmin ? [
      {
        label: 'Clients',
        path: '/clients',
      }
    ] : [],

    ...useMenuStore().clients.map(
      (cli) => ({
        label: cli.libelle,
        id: cli.id,
        open: cli.open ?? false,
        path: '/clients/' + cli.id,
        icon: 'home',
        sub_links: [
          // {
          //   label: 'Utilisateurs',
          //   path: '/users'
          //   // path: `/client/${cli.id}/utilisateurs`
          // },
          // {
          //   label: 'Demandes en attente',
          //   tag: cli.options.organisme_demande_attente,
          //   path: ''
          // },
          {
            label: 'Organismes',
            path: `/clients/${cli.id}/organismes`,
          },
        ]
      })
    )] : []
)

const fitArenaLinks = computed(() => useMenuStore().fitArenas.length ? [
      {
        label: 'Administrateur',
        path: '',
        divider: true,
      },
      ...isAdmin && [
        {
          label: 'Fit Arenas',
          path: '/fitarena',
        }
      ] || []
      , ...useMenuStore().fitArenas.map((fa) => {

        const subLinksGestionnaire = [
          // {
          //   label: 'Supervision',
          //   path: `/fitarena/${fa.id}/supervision`,
          //   tag: 1
          // },
          {
            label: 'Planning d\'ouverture',
            path: `/fitarena/${fa.id}/planning`,
            tag: 1
          },

          // {
          //   label: 'Liste des réservations',
          //   path: `/fitarena/${fa.id}/reservations`,
          //   tag: 1
          // },
          // {
          //   label: 'Statistiques',
          //   path: `/fitarena/${fa.id}/statistiques`,
          //   tag: 1
          // },
          // {
          //   label: 'Configuration de la Fit Arena',
          //   path: `/fitarena/${fa.id}/configuration`
          // },

          // {
          //   label: 'Les paiements',
          //   path: `/fitarena/${fa.id}/paiements`,
          //   tag: 1
          // },
        ]

        const subLinksAdmin = [
          {
            label: 'Planning d\'ouverture',
            path: `/fitarena/${fa.id}/planning`,
          },
          {
            label: 'Réservations',
            path: `/fitarena/${fa.id}/reservations`
          },
          {
            label: 'Activités',
            path: `/fitarena/${fa.id}/activites`
          },
          {
            label: 'Equipements motorisés',
            path: `/fitarena/${fa.id}/equipements-motorises`
          },
          {
            label: 'Equipements numériques',
            path: `/fitarena/${fa.id}/equipements-numeriques`
          },
          {
            label: 'Espaces',
            path: `/fitarena/${fa.id}/espaces`
          },
          {
            label: 'Sous-espaces',
            path: `/fitarena/${fa.id}/sous-espaces`
          },
          {
            label: 'Zones',
            path: `/fitarena/${fa.id}/zones`
          },
          {
            label: 'Activités par zone',
            path: `/fitarena/${fa.id}/activites-par-zone`
          },
          {
            label: 'Paramètres de la Fit Arena',
            path: `/fitarena/${fa.id}/params`
          },
        ]

        return {
          label: fa.libelle,
          id: fa.id,
          path: isAdmin ? '/fitarena/' + fa.id + '/config' : '/fitarena/' + fa.id,
          icon: 'home',
          open: fa.open ?? false,
          sub_links: isAdmin ? subLinksAdmin : subLinksGestionnaire
        }
      })
    ] : []
)

const organismeLinks = computed(() => isGestOrg ?
      [
        {
          label: 'Espace organisme',
          path: '',
          divider: true,
        }, ...useMenuStore().organismes.map((org: { id, libelle, open, options }) => {

        let planningSubLinks = []
        for (const fit of org.options.fitArenas) {
          planningSubLinks.push({
            label: `Mon planning ` + fit.libelle.substring(0, 20) + (fit.libelle.length > 20 ? '...' : ''),
            path: `/organismes/${org.id}/planning/${fit.id}`
          })
        }

        return {
          label: org.libelle,
          id: org.id,
          path: '/organismes/' + org.id,
          icon: 'home',
          open: org.open ?? false,
          sub_links: [
            ...planningSubLinks,
            {
              label: 'Mes adhérents',
              path: `/organismes/${org.id}/adherents`
            },
            {
              label: "Mes groupes d'adhérents",
              path: `/organismes/${org.id}/groupes`
            },
            // {
            //   label: 'Demande de créneaux',
            //   path: `/organisme/${org.id}/creneau/`
            // },
            {
              label: 'Mes animateurs',
              path: `/organismes/${org.id}/animateurs`
            },
          ]
        }
      })
      ] : []
)

const links = computed(() =>  {
  return { fit_arenas:  fitArenaLinks.value, clients: clientLinks.value, organismes: organismeLinks.value }})


onMounted(async () => {
  await fetchMenu()
})

</script>
