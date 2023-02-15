<template>
  <aside test="Thome" class="h-screen transition-transform -translate-x-full bg-white border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="bg-red-600 h-14 flex items-center">
      <router-link to="/" class="ml-2">
        <img src="../assets/logo.png" class="h-5" alt="logo">
      </router-link>
    </div>
    <div class="h-full overflow-y-auto bg-white">
      <div v-for="(link, i) in links" class="flex flex-col items-center text-base font-normal text-gray-900 ">
        <div class="flex items-center rounded-lg px-1 py-2 w-full" :class="link.divider ? 'text-xl -ml-6 text-red-600' : 'hover:bg-gray-100 text-sm'">
          <svg @click="openSubLinks(i)" class="cursor-pointer h-8 w-8" :class="link.sub_links_open ? 'rotate-90 stroke-red-600' : ''" v-if="link.sub_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          <side-nav-item :icon="link.icon" :label="link.label" :link="link.link" :tag="link.tag" :id="'T'+link.link"/>
        </div>
        <div v-for="(sub_link, sub_i) in link.sub_links" v-if="link.sub_links_open && link.sub_links.length" class="w-full flex flex-col bg-gray-100">
          <div class="flex w-full  pl-3 pr-3">
            <svg @click="openSubSubLinks(i, sub_i)" class="cursor-pointer h-8 w-8" :class="sub_link.sub_links_open ? 'rotate-90 stroke-red-600' : ''" v-if="link.sub_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
            <side-nav-item :icon="sub_link.icon" :label="sub_link.label" :link="sub_link.link" :tag="sub_link.tag"/>
          </div>
          <div v-for="sub_sub_link in sub_link.sub_links" v-if="sub_link.sub_links_open && sub_link.sub_links.length" class="w-full flex bg-gray-200 items-center pl-12 pr-3 py-2">
            <side-nav-item :icon="sub_sub_link.icon" :label="sub_sub_link.label" :link="sub_sub_link.link" :tag="sub_sub_link.tag" class="text-sm truncate"/>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">

  import SideNavItem from "./SideNavItem.vue";
  import {reactive} from "vue";
  import SideNavDivider from "./SideNavDivider.vue";

  interface Link {
    label: string
    link: string
    icon?: string
    tag?: string
    sub_links?: Link[]
    sub_links_open?: boolean
    divider?: boolean
  }

  let links: Link[] = reactive([
    {
      label: 'Administrateur',
      link: '',
      divider: true,
    },
    {
      label: 'Clients',
      link: 'clients',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
    },
    {
      label: 'FitArena',
      link: '/fitarena',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-2V10l-6-4.5L6 10v11Zm5-2h6v-2H9Zm0-4h6v-2H9Zm-2 6V11h10v10Z"/></svg>',
      sub_links: [
        {
          label: 'Dijon',
          link: '/fitarena/1',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
          sub_links: [
            {
              label: 'Activités',
              link: '/fitarena/1/activities'
            },
            {
              label: 'Equipements motorisés',
              link: '/fitarena/1/params'
            },
            {
              label: 'Equipements numériques',
              link: '/fitarena/1/params'
            },
            {
              label: 'Espaces',
              link: '/fitarena/1/spaces'
            },
            {
              label: 'Sous-espaces',
              link: '/fitarena/1/sub_spaces'
            },
            {
              label: 'Zones',
              link: '/fitarena/1/zones'
            },
            {
              label: 'Activités par zone',
              link: '/fitarena/1/activities_by_zone'
            },
            {
              label: 'Paramètres de la Fit Arena',
              link: '/fitarena/1/params'
            },
            {
              label: 'Affichage web',
              link: '/fitarena/1/web'
            }
          ]
        },
      ],
    },
    {
      label: 'Utilisateurs',
      link: 'users',
      tag: "0",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
      /*sub_links: [
        {
          sub_links: [
            {
              label: 'Sub sub link',
              link: 'totosub',
              tag: "0",
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
            },
          ],
          label: 'SUb link',
          link: 'toto',
          tag: "0",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
        },
        {label: 'Test', link: 'toto', tag: "3"},
        {label: 'Test', link: 'toto', tag: "0"}
      ]*/
    },
    {
      label: 'Modèles de mail',
      link: 'clients',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
    },
    {
      label: 'Mails envoyés',
      link: 'clients',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
    },
    {
      label: 'Actualités',
      link: 'clients',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 9h2V7h-2Zm0 4h2v-2h-2Zm0 4h2v-2h-2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18ZM1 21V11l7-5l7 5v10H9v-5H7v5Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12Zm14-9Zm-6 9v-5H5v5v-5h6Z"/></svg>'
    },
    {
      label: 'Client', link: 'client'
    }
  ])

  const openSubLinks = (i) => {
    links[i].sub_links_open = !links[i].sub_links_open
  }

  const openSubSubLinks = (i, sub_i) => {
    let sub_links = links[i].sub_links
    sub_links[sub_i].sub_links_open = !sub_links[sub_i].sub_links_open
  }

</script>
