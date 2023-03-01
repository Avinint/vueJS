<template>
  <Card>
    <h1>Activités par zone</h1>
    <div class="p-10">
      <Card class="space-y-3 mb-10" v-for="zoneFit of zones">
        <h2>{{zoneFit.libelle}}</h2>

        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">Actif</th>
              <th scope="col" class="px-6 py-3">Libellé</th>
              <th scope="col" class="px-6 py-3">Ordre</th>
            </tr>
            </thead>
            <tbody>
            <tr class="bg-white" v-for="(act, i) in zoneFit.zoneActivites">
              <td class="flex justify-center items-center p-3">
                <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeActivite(i)"/>
                <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editActivite(i)"/>
              </td>
              <td class="px-6 py-4">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="true" class="sr-only peer" v-if="act.actif" checked >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                </label>
              </td>
              <td class="px-6 py-4">{{ act.activite.libelle }}</td>

              <td class="px-6 py-4">{{ act.ordre }}</td>
              <td class="px-6 py-4">
                <Button label="Détails" type="secondary" @click="showActivite(i)"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <Button label="Ajouter une Activite" icon="add" type="secondary" @click="addActivite" id="TaddActivite"/>
      </Card>
    </div>
  </Card>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import {onMounted, ref} from "vue";
import {
  deleteActivitesByZones,
  getActiviteByZone,
  getActivitesByZones,
  postActivitesByZones,
  updateActivitesByZones
} from "../../api/activiteByZone";
import {
  getZones
} from "../../api/zone";
import {getActivites} from "../../api/activite";

const props = defineProps(['id'])
const activiteZone_modal = ref(false)
const readonly = ref(false)
const id_selected = ref(0)
const activiteZones = ref([])
const zones = ref([])
const zone = ref({})
const activiteZone = ref({})
const activiteZone_selected = ref({})
const activites = ref([])

const addActiviteZone = () => {
  activiteZone_modal.value = true
}

const removeActiviteZone = async (i) => {
  await deleteActiviteZone(i)
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena='+props.id)
  activites.value = await getActivites(props.id)
  activiteZone_modal.value = false
}

const editActiviteZone = async (i) => {
  const equipementTemp = await getActiviteByZone(i)
  mapApiToData(equipementTemp)
  activiteZone_modal.value = true
  readonly.value = false
}

const showActiviteZone = async (i) => {
  const activiteZoneTemp = await getActiviteByZone(i)
  mapApiToData(activiteZoneTemp)
  activiteZone_modal.value = true
  readonly.value = true
}

const mapApiToData = (activiteZoneTemp) => {
  activiteZone.value = activiteZoneTemp
  id_selected.value = activiteZoneTemp.id
  activiteZone_selected.value = activiteZoneTemp.typeEquipement.id
}

const saveActiviteZone = async () => {
  const ActiviteZoneTemp = {
    zone: '/api/zones/' + zone_selected.value,
    activite: '/api/zones/' + activite_selected.value,
    ordre: equipement.value.libelle,
    actif: equipement.value.actif == true ? equipement.actif.statut : false
  }
  if (id_selected.value) {
    const {data} = await updateActivitesByZones(ActiviteZoneTemp, id_selected.value)
  } else {
    const {data} = await postActivitesByZones(ActiviteZoneTemp)
  }
  activiteZone_modal.value = false
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena='+props.id)
  activites.value = await getActivites(props.id)


}
onMounted(async () => {
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena='+props.id)
  activites.value = await getActivites(props.id)
})

const cancel = () => {
  equipement.value = {}
}
</script>
