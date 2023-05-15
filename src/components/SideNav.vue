<template>
  <div>
    <aside id="logo-sidebar"
      class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full font-normal duration-75 lg:flex transition-width"
      aria-label="Sidebar">
      <div class="bg-red-600 h-14 flex items-center">
        <router-link test="Thome" to="/" class="ml-2">
          <img src="../assets/logo.png" class="h-5 ml-10" alt="logo">
        </router-link>
      </div>
      <div class="h-full overflow-y-auto bg-white ">
        <div v-for="(link, i) in links" :key="i" class="flex flex-col items-center text-base font-normal text-gray-900 ">
          <div class="flex items-center ml-10 px-1 py-2 w-full"
            :class="link.divider ? 'text-xl -ml-6 text-red-600' : 'hover:bg-gray-100 text-sm'">
            <svg @click="openSubLinks(i)" class="cursor-pointer h-8 w-8"
              :class="link.sub_links_open ? 'rotate-90 stroke-red-600' : ''" v-if="link.sub_links"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
            <side-nav-item :icon="link.icon" :label="link.label" :path="link.path" :tag="link.tag"
              :id="'T' + link.path" />
          </div>
          <div v-for="(sub_link, sub_i) in link.sub_links" v-if="link.sub_links_open && link.sub_links.length"
            class="w-full flex flex-col bg-gray-100">
            <div class="flex w-full pl-3 pr-3">
              <svg @click="openSubSubLinks(i, sub_i)" class="cursor-pointer h-8 w-8"
                :class="sub_link.sub_links_open ? 'rotate-90 stroke-red-600' : ''" v-if="link.sub_links"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
              <side-nav-item :icon="sub_link.icon" :label="sub_link.label" :path="sub_link.path" :tag="sub_link.tag" />
            </div>
            <div v-for="sub_sub_link in sub_link.sub_links" v-if="sub_link.sub_links_open && sub_link.sub_links.length"
              class="w-full flex bg-gray-200 items-center pl-12 pr-3 py-2">
              <side-nav-item :icon="sub_sub_link.icon" :label="sub_sub_link.label" :path="sub_sub_link.path"
                :tag="sub_sub_link.tag" class="text-sm truncate" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">

import SideNavItem from "./SideNavItem.vue"
import { onMounted, reactive, ref } from "vue"
import { getFitArenas } from '../api/fit-arena'
import Link from '../types/Link'

const fas = ref([])

let links: Link[] = reactive([
  {
    label: 'Administrateur',
    path: '',
    divider: true,
  },
  {
    label: 'Clients',
    path: '/clients',
    icon: '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.625 16.375V4.23438H4.23438V0.625H12.7656V7.84375H16.375V16.375H9.65938V12.7656H7.34063V16.375H0.625ZM1.9375 15.0625H4.23438V12.7656H1.9375V15.0625ZM1.9375 11.4531H4.23438V9.15625H1.9375V11.4531ZM1.9375 7.84375H4.23438V5.54688H1.9375V7.84375ZM5.54688 11.4531H7.84375V9.15625H5.54688V11.4531ZM5.54688 7.84375H7.84375V5.54688H5.54688V7.84375ZM5.54688 4.23438H7.84375V1.9375H5.54688V4.23438ZM9.15625 11.4531H11.4531V9.15625H9.15625V11.4531ZM9.15625 7.84375H11.4531V5.54688H9.15625V7.84375ZM9.15625 4.23438H11.4531V1.9375H9.15625V4.23438ZM12.7656 15.0625H15.0625V12.7656H12.7656V15.0625ZM12.7656 11.4531H15.0625V9.15625H12.7656V11.4531Z" fill="#DE001A"/></svg>'
  },
  {
    label: 'FitArena',
    path: '/fitarena',
    icon: '<svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.8625 15.0189H5.0125V9.50644H10V15.0189H13.15V6.55332L7.50625 2.33145L1.8625 6.55332V15.0189ZM0.375 16.5064V5.80957L7.50625 0.450195L14.6375 5.80957V16.5064H8.57812V10.9283H6.43437V16.5064H0.375Z" fill="#DE001A"/></svg>',
    sub_links: fas
  },
  {
    label: 'Utilisateurs',
    path: 'users',
    tag: "0",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
    /*sub_links: [
      {
        sub_links: [
          {
            label: 'Sub sub link',
            path: 'totosub',
            tag: "0",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
          },
        ],
        label: 'SUb link',
        path: 'toto',
        tag: "0",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
      },
      {label: 'Test', path: 'toto', tag: "3"},
      {label: 'Test', path: 'toto', tag: "0"}
    ]*/
  },
  {
    label: 'Modèles de mail',
    path: 'clients',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
  },
  {
    label: 'Mails envoyés',
    path: 'clients',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
  },
  {
    label: 'Actualités',
    path: 'clients',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
  }
])

const openSubLinks = (i) => {
  links[i].sub_links_open = !links[i].sub_links_open
}

const openSubSubLinks = (i, sub_i) => {
  let sub_links = links[i].sub_links
  sub_links[sub_i].sub_links_open = !sub_links[sub_i].sub_links_open
}

onMounted(async () => {
  const fit_arenas = await getFitArenas()
  fas.value = fit_arenas.map((fa) => {
    return {
      label: fa.libelle,
      path: '/fitarena/' + fa.id,
      sub_links: [
        {
          label: 'Planning d\'ouverture',
          path: `/fitarena/${fa.id}/planning`
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
        {
          label: 'Affichage web',
          path: `/fitarena/${fa.id}/web`
        }
      ]
    }
  })
})

</script>
