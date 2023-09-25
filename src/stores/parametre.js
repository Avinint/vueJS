import { defineStore } from 'pinia'
import { getParametresParFitArena } from '@api/parametres.js'
import { computed, ref } from "vue";
import { getActivites } from "@api/activite.ts";
export const useParamStore = defineStore('params', () => {

  const activites = ref([])
  const parametres = ref({})
  const parametreFitArenas = computed(() => parametres.value.parametreFitArenas)
  const parametreActivites = computed(() => parametres.value.parametreActivites)
  const parametreFitArenaProfils = computed(() => parametres.value.parametreFitArenaProfils)
  const parametreZones = computed(() => parametres.value.parametreZones)

  async function fetchParametres(id) {
    parametres.value = await getParametresParFitArena(id)
    return parametres.value
  }
  async function fetchActivites(id) {
    activites.value = await getActivites(id)
    return activites.value
  }

  return { fetchParametres, fetchActivites,  activites, parametres, parametreFitArenas, parametreActivites, parametreFitArenaProfils, parametreZones }

})
