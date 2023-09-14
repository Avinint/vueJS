<script setup>

import dayjs from 'dayjs'
import html2pdf from "html2pdf.js";
import { computed, nextTick } from "vue";

const props = defineProps({
  carte: Object,
})

const codes = {
  "gestionnaire d'organisme": 'gestorg',
  "gestionnaire de collectivite": 'gestcol',
  "animateur": 'animateur'
}

const nom = computed(( ) => {
  return codes[props.carte.type] ?? 'fitarena'
})

const options = {
  filename: `carte_acces_${nom.value}.pdf`,
  margin: [10, 0]
};

const imprimer = async() => {
  const template = document.querySelector('.document-a-imprimer')
  await nextTick()
  html2pdf().set(options).from(template).save()
}

defineExpose({
  imprimer
})

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