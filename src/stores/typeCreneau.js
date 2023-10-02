import { defineStore } from 'pinia'
import { ref } from "vue";
import { getTypeCreneaux } from "@api/typeCreneau.js";

export const useTypeCreneauStore = defineStore('typeCreneau', () => {
  const typeCreneauListe = ref([])

  const fetchTypeCreneaux = async () => {
    typeCreneauListe.value = (await getTypeCreneaux()).filter(type => !['animateur', 'seance'].includes(type.code))
  }

  return { fetchTypeCreneaux, typeCreneauListe }
})