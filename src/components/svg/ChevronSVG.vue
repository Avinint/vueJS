<script setup>
  const props = defineProps({
    open: Boolean,
    visible: Boolean,
  })

  const emit = defineEmits(['openMenuItem'])

</script>

<template>
  <svg @click=" emit('openMenuItem')" class="cursor-pointer h-8 w-8"
       :class="props.open ? 'rotate-90' : ''" v-if="props.visible"
       xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"/>
  </svg>
</template>

<style scoped lang="scss">
 .home{
   height: 25px;
   display: inline-block;
   color: inherit;
   padding:  0 3px 4px 7px;
 }
</style>