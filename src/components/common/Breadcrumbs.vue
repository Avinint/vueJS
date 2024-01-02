<template>
  <nav class="flex">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <router-link
          to=""
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
        <HomeSVG class="mr-2 h-6 w-6" />
          Accueil
        </router-link>
      </li>
      <li v-for="(item, itemIdx) in props.items" :key="itemIdx">
        <div class="flex items-center">
          <ChevronSVG :open="false" :visible="true" class="mt-2 h-10 w-10" />
          <router-link
            :to="item.link ?? ''"
            :class="item.link ? 'hover:text-blue-600' : ''"
            class="ml-1 text-sm font-medium text-red-600 md:ml-2"
            >{{ item.label }}</router-link
          >
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import HomeSVG from "@components/svg/HomeSVG.vue";
import ChevronSVG from "@components/svg/ChevronSVG.vue";

const props = defineProps({
  items: Object
})
</script>

<style scoped></style>
