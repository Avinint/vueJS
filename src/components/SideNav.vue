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
      <div class="h-full overflow-y-auto bg-white pl-2">
        <div v-for="(link, i) in links" :key="i" class="flex flex-col items-center text-base font-normal text-gray-900">

          <div class="flex items-center pl-8 pr-1 py-2 w-full"
               :class="link.divider ? 'text-xl -ml-6 text-red-600' : 'hover:bg-gray-100 -ml-14 text-sm'">
            <svg @click="openSubLinks(i)" class="cursor-pointer h-8 w-8"
                 :class="link.sub_links_open ? 'rotate-90 stroke-red-600' : ''" v-if="link.sub_links"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"/>
            </svg>
            <side-nav-item :icon="link.icon ?? ''" :label="link.label" :path="link.path" :tag="link.tag"
                           :id="'T' + link.path"/>
          </div>
          <div class="w-full bg-gray-100">
            <div v-for="(sub_link, sub_i) in link.sub_links" v-if="link.sub_links_open && link.sub_links.length"
                 class="flex flex-col items-center text-base font-normal text-gray-900">
              <div class="flex items-center pl-8 pr-1 py-2 w-full hover:bg-gray-100 text-sm">

                <svg @click="openSubSubLinks(i, sub_i)" v-if="sub_link.sub_links" class="cursor-pointer h-8 w-8"
                     :class="sub_link.sub_links_open ? 'rotate-90 stroke-red-600' : ''"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"/>
                </svg>
                <side-nav-item :icon="cityIcone" :label="sub_link.label" :path="sub_link.path" :tag="sub_link.tag"/>
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
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">

import SideNavItem from "./SideNavItem.vue"
import {onMounted, reactive, ref} from "vue"
// import { getFitArenas } from '../api/fit-arena'
import Link from '../types/Link'
import { getMenu as getMenuData } from "@api/menu";
import {useUserStore} from "@/stores/user.js";

const {isAdmin, isGestCo, isGestOrg} = useUserStore();

const fas = ref([])
const fitArenaLinks = ref([])
const clientLinks = ref([])
const organismeLinks = ref([])

const homeIcone = '<svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.8625 15.0189H5.0125V9.50644H10V15.0189H13.15V6.55332L7.50625 2.33145L1.8625 6.55332V15.0189ZM0.375 16.5064V5.80957L7.50625 0.450195L14.6375 5.80957V16.5064H8.57812V10.9283H6.43437V16.5064H0.375Z" fill="#DE001A"/></svg>'
const cityIcone = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.625 16.375V4.23438H4.23438V0.625H12.7656V7.84375H16.375V16.375H9.65938V12.7656H7.34063V16.375H0.625ZM1.9375 15.0625H4.23438V12.7656H1.9375V15.0625ZM1.9375 11.4531H4.23438V9.15625H1.9375V11.4531ZM1.9375 7.84375H4.23438V5.54688H1.9375V7.84375ZM5.54688 11.4531H7.84375V9.15625H5.54688V11.4531ZM5.54688 7.84375H7.84375V5.54688H5.54688V7.84375ZM5.54688 4.23438H7.84375V1.9375H5.54688V4.23438ZM9.15625 11.4531H11.4531V9.15625H9.15625V11.4531ZM9.15625 7.84375H11.4531V5.54688H9.15625V7.84375ZM9.15625 4.23438H11.4531V1.9375H9.15625V4.23438ZM12.7656 15.0625H15.0625V12.7656H12.7656V15.0625ZM12.7656 11.4531H15.0625V9.15625H12.7656V11.4531Z" fill="#DE001A"/></svg>'

let links: Link[] = reactive([])

// {
//   label: 'Fit Arena',
//   path: '',
//   divider: true,
// },
// {
//   label: 'FitArena',
//   path: '/fitarena',
//   icon: cityIcone,
//   sub_links: fitArenaLinks
// },
// {
//   label: 'Espace client',
//   path: '',
//   divider: true,
// },
// {
//   label: 'Clients',
//   path: '/clients',
//   icon:
//   sub_links: clientLinks
// },
// {
//   label: 'Espace organisme',
//   path: '',
//   divider: true,
// },
// {
//   label: 'Organismes',
//   path: '/organismes',
//   icon: '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.625 16.375V4.23438H4.23438V0.625H12.7656V7.84375H16.375V16.375H9.65938V12.7656H7.34063V16.375H0.625ZM1.9375 15.0625H4.23438V12.7656H1.9375V15.0625ZM1.9375 11.4531H4.23438V9.15625H1.9375V11.4531ZM1.9375 7.84375H4.23438V5.54688H1.9375V7.84375ZM5.54688 11.4531H7.84375V9.15625H5.54688V11.4531ZM5.54688 7.84375H7.84375V5.54688H5.54688V7.84375ZM5.54688 4.23438H7.84375V1.9375H5.54688V4.23438ZM9.15625 11.4531H11.4531V9.15625H9.15625V11.4531ZM9.15625 7.84375H11.4531V5.54688H9.15625V7.84375ZM9.15625 4.23438H11.4531V1.9375H9.15625V4.23438ZM12.7656 15.0625H15.0625V12.7656H12.7656V15.0625ZM12.7656 11.4531H15.0625V9.15625H12.7656V11.4531Z" fill="#DE001A"/></svg>',
//   sub_links: organismeLinks
// },


const openSubLinks = (i) => {
  links[i].sub_links_open = !links[i].sub_links_open
}

const openSubSubLinks = (i, sub_i) => {
  let sub_links = links[i].sub_links
  sub_links[sub_i].sub_links_open = !sub_links[sub_i].sub_links_open
}

const getMenu = async () => {
  const menu = await getMenuData()
 return menu.menu;

}

onMounted(async () => {
  const {clients = false, fitarenas = false, organismes = false} = await getMenu()

  if (clients) {
    clientLinks.value = clients.map((cli) => {

      return {
        label: cli.libelle,
        path: '/clients/' + cli.id,
        icon: homeIcone,
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
      }
    })
  }

  if (isGestOrg && organismes) {
    organismeLinks.value = organismes.map((org) => {

      let planningSubLinks = []
      for (const fit of org.options.fitArenas) {
        planningSubLinks.push({
          label: `Mon planning ` + fit.libelle.substring(0, 20) + (fit.libelle.length > 20 ? '...' : ''),
          path: `/organismes/${org.id}/planning/${fit.id}`
        })
      }

      return {
        label: org.libelle,
        path: '/organismes/' + org.id,
        icon: homeIcone,
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
  }

  if (fitarenas) {
    fitArenaLinks.value = fitarenas.map((fa) => {

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
        path: isAdmin ? '/fitarena/' + fa.id + '/config' : '/fitarena/' + fa.id,
        icon: homeIcone,
        sub_links: isAdmin ? subLinksAdmin : subLinksGestionnaire
      }
    })
  }

  if (fitArenaLinks.value.length) {
    links.push({
        label: 'Administrateur',
        path: '',
        divider: true,
      })

    if (isAdmin) {
      links.push({
        label: 'Fit Arenas',
        path: '/fitarena',
      })
    }

    for (const faLink of fitArenaLinks.value) {
      links.push(faLink)
    }
  }

  if (clientLinks.value.length) {
    links.push(
      {
        label: 'Espace client',
        path: '',
        divider: true,
      })

    if (isAdmin) {
      links.push({
        label: 'Clients',
        path: '/clients',
      })
    }

    for (const cliLink of clientLinks.value) {
      links.push(cliLink)
    }
  }

  if (organismeLinks.value.length) {
    if (isGestOrg) {
      links.push({
        label: 'Espace organisme',
        path: '',
        divider: true,
      })

      for (const orgLink of organismeLinks.value) {
        links.push(orgLink)
      }
    }

  }
})

</script>
