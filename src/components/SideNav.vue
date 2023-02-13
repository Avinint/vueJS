<template>
  <aside id="logo-sidebar" class="w-64 h-screen pt-2 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="h-full overflow-y-auto bg-white px-2">
      <div v-for="(link, i) in LINKS" >
        <router-link :to="link.link" class="flex flex-col items-center text-base font-normal text-gray-900" >
          <div class="flex items-center w-full hover:bg-gray-100 rounded-lg px-1 py-2">
            <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-150 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span class="flex-1 ml-3 whitespace-nowrap">{{ link.label }}</span>
            <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" v-if="link.tag">{{ link.tag }}</span>
            <svg @click="openSubLinks(i)" :class="link.sub_links_open ? 'rotate-180' : ''" v-if="link.sub_links" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/></svg>
          </div>
          <div class="space-y-2 w-full" v-if="link.sub_links_open">
              <router-link :to="sub_link.link" v-for="sub_link in link.sub_links" class="flex items-center w-full hover:bg-gray-100 rounded-lg pl-5 pr-5 py-2 justify-between">
                {{sub_link.label}}
                <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" v-if="sub_link.tag">{{ sub_link.tag }}</span>
              </router-link>
          </div>
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">

interface Link {
  label: string
  link: string
  tag?: string
  sub_links?: Link[]
  sub_links_open?: boolean
}

  import {reactive} from "vue";

  let LINKS: Link[] = reactive([
    {
      label: 'Utilisateurs',
      link: 'users',
      tag: "0",
      sub_links: [
        {label: 'Test', link: 'toto', tag: "0"},
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
    LINKS[i].sub_links_open = !LINKS[i].sub_links_open
  }

</script>
