import { defineStore } from 'pinia'
import { getParametresParFitArena } from '@api/parametres.js'
import { computed } from "vue";
import { getActivites } from "@api/activite.ts";
export const useParamStore = defineStore('user', () => {

  const activites = ref([])
  const parametres = ref({})
  const parametreFitArenas = computed(() => parametres.value.parametreFitArenas)
  const parametreActivites = computed(() => parametres.value.parametreActivites)
  const parametreFitArenaProfils = computed(() => parametres.value.parametreFitArenaProfils)

  async function fetchParametres(id) {
    console.log("yolo")
    this.parametres.value = await getParametresParFitArena(id)
  }
  async function fetchActivites() {
    this.activites.value = await getActivites()
  }

  return { fetchParametres, fetchActivites, parametres, parametreFitArenas, parametreActivites, parametreFitArenaProfils }

})
