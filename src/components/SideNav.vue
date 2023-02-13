<template>
  <aside id="logo-sidebar" class="w-80 h-screen pt-2 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="h-full overflow-y-auto bg-white px-1">
      <div v-for="(link, i) in links" class="flex flex-col items-center text-base font-normal text-gray-900 ">
        <div class="flex items-center hover:bg-gray-100 rounded-lg px-1 py-2 w-full">
          <svg @click="openSubLinks(i)" class="cursor-pointer" :class="link.sub_links_open ? '' : '-rotate-90'" v-if="link.sub_links" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/></svg>
          <side-nav-item :icon="link.icon" :label="link.label" :link="link.link" :tag="link.tag"/>
        </div>
        <div v-for="(sub_link, sub_i) in link.sub_links" v-if="link.sub_links_open && link.sub_links.length" class="w-full flex flex-col bg-gray-200 rounded-lg">
          <div class="flex w-full hover:bg-gray-100 rounded-lg pl-3 pr-3 py-2">
            <svg @click="openSubSubLinks(i, sub_i)" class="cursor-pointer" :class="sub_link.sub_links_open ? '' : '-rotate-90'" v-if="sub_link.sub_links" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/></svg>
            <side-nav-item :icon="sub_link.icon" :label="sub_link.label" :link="sub_link.link" :tag="sub_link.tag"/>
          </div>
          <div v-for="sub_sub_link in sub_link.sub_links" v-if="sub_link.sub_links_open && sub_link.sub_links.length" class="w-full flex bg-gray-300 hover:bg-gray-100 rounded-lg items-center pl-12 pr-3 py-2">
            <side-nav-item :icon="sub_sub_link.icon" :label="sub_sub_link.label" :link="sub_sub_link.link" :tag="sub_sub_link.tag"/>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">

  import SideNavItem from "./SideNavItem.vue";

  interface Link {
    label: string
    link: string
    icon?: string
    tag?: string
    sub_links?: Link[]
    sub_links_open?: boolean
  }

  import {reactive} from "vue";

  let links: Link[] = reactive([
    {
      label: 'Utilisateurs',
      link: 'users',
      tag: "0",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93c0 1.07-.86 1.93-1.93 1.93c-1.07 0-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36c0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09z"/></svg>',
      sub_links: [
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
      ]
    },
    {
      label: 'FitArena', link: 'fitarena', tag: "0"
    },
    {
      label: 'Collectivité', link: 'collectivite', tag: "0"
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
