import { defineStore } from 'pinia'
import { ref, toRaw } from "vue";
import { getMenu } from "@api/menu.js";

export const useMenuStore = defineStore('menu', () => {
  const clients = ref([])
  const fitArenas = ref([])
  const organismes = ref([])

  const toggleOrganisme = (id, open) => {
    const organisme = organismes.value.find(el => el.id === id)
    organisme.open = open
  }

  const toggleClient = (id, open) => {
    const client = clients.value.find(el => el.id === id)
    client.open = open
  }

  const toggleFitArena = (id, open) => {
    const fitArena = fitArenas.value.find(el => el.id === id)
    fitArena.open = open
  }
    const fetchMenu = async() => {
      ({
        menu: {
          clients: clients.value = [],
          fitarenas: fitArenas.value = [],
          organismes: organismes.value = []
        }
      } = await getMenu())
    }

  const getOrganismes = () => organismes.length ? organismes : clients.value.map(({ options: { organismes}}) => toRaw(organismes)).flat()


    return { fetchMenu, clients, fitArenas, organismes, getOrganismes, toggleOrganisme, toggleFitArena, toggleClient}
})