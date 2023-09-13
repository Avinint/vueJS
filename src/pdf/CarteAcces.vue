<script setup>

import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import html2pdf from "html2pdf.js";
const props = defineProps(
  {
    carte: Object
  }
)
onMounted(() => {
  const template = document.querySelector('.document-a-imprimer')
  html2pdf().from(template).save()
  emits('impressionTerminee')

})

const emits = defineEmits(['impressionTerminee'])

</script>

<template>
 <div class="document-a-imprimer">
  <div class="flex justify-center"><h1 class="mb-3">Carte d'accès</h1></div>

  <div class="flex justify-center mb-3">{{ props.carte.nom }} {{ props.carte.prenom }}</div>
  <div class="flex justify-center mb-3"><img :src="props.carte.qrCode" alt="QrCode"></div>
  <div class="flex justify-center mb-3">{{ props.carte.uuid }}</div>
  <div class="flex justify-center mb-3">{{ props.carte.type }}</div>
  <div class="flex justify-center mb-3">{{ dayjs(props.carte.dateCreation).format('DD/MM/YYYY')  }}</div>
 </div>
</template>

<style scoped lang="scss">
  .center {
    text-align: center;
  }


</style>