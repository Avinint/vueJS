<template>
  <div class="overflow-y-auto">
    <aside id="logo-sidebar" aria-label="Sidebar"
      class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-80 h-full font-normal duration-75 lg:flex transition-width">
      <div class="bg-red-600 h-14 flex items-center">
        <router-link test="Thome" to="/" class="ml-2">
          <img src="@/assets/logo.png" class="h-5 ml-10" alt="logo">
        </router-link>
      </div>

      <div v-if="isAdmin" class="mt-4 bg-white">
        <div class="pl-8 mb-2">
          <p class="text-red-600 text-xl">Administrateur</p>
        </div>
        <div v-for="adminlink, i in adminLinks" :key="`adminlink-` + i" class="flex flex-col pl-8 pt-2">
          <div class="mb-4">
            <router-link :to="adminlink.path" class="flex items-center">
              <UserSVG v-if="adminlink.img === 'user'" />
              <HomeSVG v-if="adminlink.img === 'home'" />
              <p class="pl-4">{{ adminlink.label }}</p>
            </router-link>
          </div>
        </div>
      </div>

      <div class="h-full overflow-y-auto bg-white">
        <template v-for="(links_by_type, type) in links">
          <div v-for="(link, i) in links_by_type" :key="i" class="flex flex-col items-center text-base font-normal text-gray-900">
            <div class="flex items-center pl-8 pr-1 py-2 w-full" :class="link.divider ? 'text-xl -ml-6 text-red-600' : '-ml-14 text-sm'">
              <ChevronSVG :open="link.open" :visible="link.sub_links !== undefined" @openMenuItem="openSubLinks(link, type)" />
              <side-nav-item :icon="link.icon ?? ''" :label="link.label" :path="link.path" :tag="link.tag"
                             :id="'T' + link.path">
                <CitySVG v-if="link.icon === 'city'" />
                <HomeSVG v-if="link.icon === 'home'" />
                <UserSVG v-if="link.icon === 'user'" />
              </side-nav-item>
            </div>
            <div class="w-full bg-gray-100">
              <div v-for="(sub_link, sub_i) in link.sub_links" v-if="link.open && link.sub_links.length" class="flex flex-col items-center text-base font-normal text-gray-900">
                <div class="flex items-center pl-12 pr-1 py-2 w-full text-sm " :class="sub_link.label.includes('Activités de la Fit Arena') ? 'border-t border-black' : ''">
                  <ChevronSVG v-if="sub_link.label !== 'Statistiques'" :open="sub_link.sub_links_open" :visible="sub_link.sub_links !== undefined" @openMenuItem="openSubSubLinks(i, sub_i)" />
                  <side-nav-item v-if="sub_link.label !== 'Statistiques'" :icon="sub_link.icon" :label="sub_link.label" :path="sub_link.path" :tag="sub_link.tag">
                    <CitySVG v-if="sub_link.icon && sub_link.icon === 'city'" />
                    <HomeSVG v-if="sub_link.icon && sub_link.icon === 'home'" />
                    <MonitoringSVG v-if="sub_link.icon && sub_link.icon === 'monitoring'" />
                    <PlanningSVG v-if="sub_link.icon && sub_link.icon === 'planning'" class="ml-0.5" />
                    <BookingSVG v-if="sub_link.icon && sub_link.icon === 'booking'" />
                    <ReductionsSVG v-if="sub_link.icon && sub_link.icon === 'reduction'" />
                    <TarifSVG v-if="sub_link.icon && sub_link.icon === 'tarif'" />
                    <UserSVG v-if="sub_link.icon && sub_link.icon === 'user'" />
                  </side-nav-item>
                  <a v-if="sub_link.label == 'Statistiques'" @click="goToStats()" href="#" target="_blank" class="flex">
                    <StatsSVG />
                    <p class="ml-3">Statistiques</p>
                  </a>
                </div>
                <div v-for="sub_sub_link in sub_link.sub_links"
                     v-if=" sub_link.sub_links && sub_link.sub_links_open && sub_link.sub_links.length"
                     class="w-full flex text-left bg-gray-200 items-center pl-12 pr-3 py-2">
                  <side-nav-item :icon="sub_sub_link.icon" :label="sub_sub_link.label" :path="sub_sub_link.path" :tag="sub_sub_link.tag" class="text-sm truncate" />
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
import HomeSVG from "@components/svg/HomeSVG.vue"
import CitySVG from "@components/svg/CitySVG.vue"
import UserSVG from "@components/svg/UserSVG.vue"
import MonitoringSVG from "@components/svg/MonitoringSVG.vue"
import PlanningSVG from "@components/svg/PlanningSVG.vue"
import BookingSVG from "@components/svg/BookingSVG.vue"
import ChevronSVG from "@components/svg/ChevronSVG.vue"
import StatsSVG from "@components/svg/StatsSVG.vue"
import TarifSVG from "@components/svg/TarifSVG.vue"
import ReductionsSVG from "@components/svg/ReductionsSVG.vue"

import { useUserStore } from "@/stores/user.js"
import { useMenuStore } from "@/stores/menu.js"

import { computed, onMounted } from "vue"

const { toggleOrganisme, toggleFitArena, toggleClient, fetchMenu } = useMenuStore()
const { isAdmin, isGestOrg } = useUserStore()

onMounted(async () => {
  await fetchMenu()
})

const goToStats = () => {
  window.location.assign('https://admin-stat.fit-arena.fr/')
}

const links = computed(() =>  {
  return { clients: clientLinks.value, fit_arenas: fitArenaLinks.value, organismes: organismeLinks.value }
})

const openSubLinks = (link, type) => {
  link.open = !link.open
  switch (type) {
    case 'clients':
     toggleClient(link.id, link.open)
      break
    case 'fit_arenas':
      toggleFitArena(link.id, link.open)
      break
    case 'organismes':
      toggleOrganisme(link.id, link.open)
      break
  }
}

/** @note plus utilisé, mais pourrait servir dans le futur */
const openSubSubLinks = (i, sub_i) => {
  let sub_links = links.value[i].sub_links
  sub_links[sub_i].sub_links_open = !sub_links[sub_i].sub_links_open
}
// let links: Link[] = reactive([])

const adminLinks = [
  {
    path: "/users",
    img: "user",
    label: "Liste des utilisateurs"
  },
  {
    path: "/clients",
    img: "home",
    label: "Liste des clients"
  },
  {
    path: "/fitarena",
    img: "home",
    label: "Liste des Fit Arena"
  }
]

const clientLinks = computed(
  () => useMenuStore().clients.length ?

    [
    {
      label: 'Espace client',
      path: '',
      divider: true,
    },

    ...useMenuStore().clients.map(
      (cli) => ({
        label: cli.libelle,
        id: cli.id,
        open: cli.open ?? false,
        path: '/clients/' + cli.id,
        icon: 'city',
        sub_links: [
          {
            label: 'Utilisateurs',
            path: `/clients/${cli.id}/users`,
            icon: 'user'
          },
          // {
          //   label: 'Demandes en attente',
          //   tag: cli.options.organisme_demande_attente,
          //   path: ''
          // },
          {
            label: 'Organismes',
            path: `/clients/${cli.id}/organismes`,
            icon: 'home'
          },
        ]
      })
    )] : []
)

const fitArenaLinks = computed(() => useMenuStore().fitArenas.length ? [
      
    {
      label: 'Fit Arena',
      path: '',
      divider: true,
    },
      ...useMenuStore().fitArenas.map((fa) => {

        const subLinksGestionnaire = [
          {
            label: 'Planning d\'ouverture',
            path: `/fitarena/${fa.id}/planning`,
            icon: 'planning'
          },
          {
            label: 'Liste des réservations',
            path: `/fitarena/${fa.id}/reservations`,
            icon: 'booking'
          },
          {
            label: 'Liste des demandes',
            path: `/fitarena/${fa.id}/demandes`,
            icon: 'booking'
          },
          {
            label: 'Réductions',
            path: `/fitarena/${fa.id}/reductions`,
            icon: 'reduction'
          },
          {
            label: 'Tarification',
            path: `/fitarena/${fa.id}/tarifs`,
            icon: 'booking'
          },
          {
            label: 'Supervision de la Fit Arena',
            path: `/fitarena/${fa.id}/supervision`,
            icon: 'monitoring'
          },
        ]

        const subLinksAdmin = [
          {
            label: 'Planning d\'ouverture',
            path: `/fitarena/${fa.id}/planning`,
            icon: 'planning'
          },
          {
            label: 'Réservations',
            path: `/fitarena/${fa.id}/reservations`,
            icon: 'booking'
          },
          {
            label: 'Demandes',
            path: `/fitarena/${fa.id}/demandes`,
            icon: 'booking'
          },
          {
            label: 'Réductions',
            path: `/fitarena/${fa.id}/reductions`,
            icon: 'reduction'
          },
          {
            label: 'Tarification',
            path: `/fitarena/${fa.id}/tarifs`,
            icon: 'tarif'
          },
          {
            label: 'Statistiques',
            path: ``,
            icon: 'stats'
          },
          {
            label: 'Supervision de la Fit Arena',
            path: `/fitarena/${fa.id}/supervision`,
            icon: 'monitoring'
          },
          {
            label: 'Activités de la Fit Arena',
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
          }
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
            path: `/organismes/${org.id}/planning/${fit.id}`,
            icon: 'planning'
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
              path: `/organismes/${org.id}/adherents`,
              icon: 'user'
            },
            {
              label: "Mes groupes d'adhérents",
              path: `/organismes/${org.id}/groupes`,
              icon: 'user'
            },
            // {
            //   label: 'Demande de créneaux',
            //   path: `/organisme/${org.id}/creneau/`
            // },
            {
              label: 'Mes animateurs',
              path: `/organismes/${org.id}/animateurs`,
              icon: 'user'
            },
          ]
        }
      })
      ] : []
)
</script>
