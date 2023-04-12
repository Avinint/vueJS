<template>
  <Card>
    <h1>Sous-Espaces</h1>
    <span class="text-sm font-bold"
      >Sous-Espaces : Ensemble de zone d'activité dont l'accès est
      contrôlé.</span
    >
    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3">Actif</th>
            <th scope="col" class="px-6 py-3">Libellé</th>
            <th scope="col" class="px-6 py-3">Ordre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(esp, i) in subEspaces" :key="i" class="bg-white">
            <td class="flex items-center justify-center p-3">
              <Button
                test="TdeleteClient"
                borderless
                icon="delete"
                type="secondary"
                @click="removeEspace(i)"
              />
              <Button
                test="TeditClient"
                borderless
                icon="edit"
                type="secondary"
                @click="editEspace(i)"
              />
            </td>
            <td class="px-6 py-4">
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="esp.actif"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifieEspace(esp)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                ></span>
              </label>
            </td>
            <td class="px-6 py-4">{{ esp.libelle }}</td>
            <td class="px-6 py-4">{{ esp.ordre }}</td>
            <td class="px-6 py-4">
              <Button label="Détails" type="secondary" @click="showEspace(i)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Button
      id="TaddEspace"
      label="Ajouter un sous-espace"
      type="secondary"
      icon="add"
      @click="addEspace"
    />
  </Card>

  <form @submit.prevent="saveEspace">
    <Modal
      v-if="subEspace_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel=";(subEspace_modal = false), cancel()"
    >
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Nom</label
        >
        <input
          id="TEspaceLibelle"
          v-model="subEspace.libelle"
          :readonly="readonly"
          type="text"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder=""
          required
        />
      </div>
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Espace</label
        >
        <select
          v-if="espaceParents.length"
          id="TfaSelectEspace"
          v-model="espace_selected"
          :readonly="readonly"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option
            v-for="(espaceParent, i) in espaceParents"
            :key="i"
            :value="espaceParent.id"
          >
            {{ espaceParent.libelle }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Ordre</label
        >
        <input
          id="TEspaceOrdre"
          v-model="subEspace.ordre"
          :readonly="readonly"
          type="number"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder=""
          required
        />
      </div>
      <div class="flex items-center">
        <span class="w-1/2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Actif :
        </span>
        <label class="relative inline-flex w-full cursor-pointer items-center">
          <input
            v-model="subEspace.actif"
            type="checkbox"
            value="true"
            class="peer sr-only"
          />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          ></span>
        </label>
      </div>
      <div>
        <AjoutEquipements
          ref="ajoutEquipementsNume"
          type-equipement="numerique"
          :fa="props.id"
          :zone="id_selected"
        ></AjoutEquipements>
      </div>
      <div>
        <AjoutEquipements
          ref="ajoutEquipementsMoto"
          type-equipement="motorise"
          :fa="props.id"
          :zone="id_selected"
        ></AjoutEquipements>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import { onMounted, ref } from 'vue'
import {
  deleteZones,
  getZones,
  getZone,
  postZones,
  updateZones,
  patchZones,
} from '../../api/zone.js'
import { useRouter } from 'vue-router'
import { getTypeZone } from '../../api/typeZone'
import { toast } from 'vue3-toastify'
import {
  deleteZoneEquipement,
  postZoneEquipement,
} from '../../api/zoneEquipement'
import AjoutEquipements from '../../components/faZones/ajoutEquipement.vue'
const props = defineProps(['id'])

const subEspace_modal = ref(false)
const readonly = ref(false)

const id_selected = ref(0)
const subEspaces = ref([])
const typeZones = ref([])
const subEspace = ref({})
const espaceParents = ref([])
let espace_selected = ref({})
const modal_title = ref('')
const ajoutEquipementsNume = ref()
const ajoutEquipementsMoto = ref()

const addEspace = () => {
  cancel()
  subEspace_modal.value = true
  modal_title.value = 'Ajouter un sous-espace'
}

const removeEspace = async (i) => {
  const espaceTemp = subEspaces.value[i]
  await deleteZones(espaceTemp.id)
  cancel()
  subEspaces.value = await getZones(
    1,
    '&typeZone.code=sous-espace&fitArena=' + props.id
  )
  subEspace_modal.value = false
}

const modifieEspace = async ({ actif, id }) => {
  try {
    await patchZones({ actif }, id)
    toast.success('Modification du sous espace avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const editEspace = async (i) => {
  const espaceTemp = subEspaces.value[i]
  mapApiToData(espaceTemp)
  subEspace_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier un sous-espace'
}

const showEspace = async (i) => {
  const espaceTemp = subEspaces.value[i]
  mapApiToData(espaceTemp)
  subEspace_modal.value = true
  readonly.value = true
  modal_title.value = "Informations d'un sous-espace"
}

const mapApiToData = async (espaceTemp) => {
  const espaceParent = await getZone(espaceTemp.idZoneParent)
  espace_selected.value = espaceParent.id
  subEspace.value = espaceTemp
  id_selected.value = espaceTemp.id
  //Je cherche l'espace parent si il existe
}

const saveEspace = async () => {
  const espaceTemp = await getTypeZone(1, '&code=sous-espace')
  const espTemp = {
    typeZone: '/api/type_zones/' + espaceTemp[0].id,
    fitArena: '/api/fit_arenas/' + props.id,
    ordre: subEspace.value.ordre,
    libelle: subEspace.value.libelle,
    actif: subEspace.value.actif == true ? subEspace.value.actif : false,
    idZoneParent: espace_selected.value,
  }
  if (id_selected.value) {
    const { data } = await updateZones(espTemp, id_selected.value)
    await linkedEquipements(
      ajoutEquipementsNume.value.typeEquipements,
      id_selected.value
    )
    await linkedEquipements(
      ajoutEquipementsMoto.value.typeEquipements,
      id_selected.value
    )
  } else {
    try {
      const data = await postZones(espTemp)
      await linkedEquipements(
        ajoutEquipementsNume.value.typeEquipements,
        data.id
      )
      await linkedEquipements(
        ajoutEquipementsMoto.value.typeEquipements,
        data.id
      )
    } catch (e) {
      console.error(e)
    }
  }
  subEspace_modal.value = false
  cancel()
  subEspaces.value = await getZones(
    1,
    '&typeZone.code=sous-espace&fitArena=' + props.id
  )
  espaceParents.value = await getZones(
    1,
    '&typeZone.code=espace&fitArena=' + props.id
  )
  typeZones.value = await getTypeZone()
}

onMounted(async () => {
  subEspaces.value = await getZones(
    1,
    '&typeZone.code=sous-espace&fitArena=' + props.id
  )
  espaceParents.value = await getZones(
    1,
    '&typeZone.code=espace&fitArena=' + props.id
  )
  typeZones.value = await getTypeZone()
})

const cancel = () => {
  espace_selected.value = {}
  subEspace.value = {}
  readonly.value = false
}

const linkedEquipements = async (typeEquipements, zoneId) => {
  for (let typeEquipement of typeEquipements) {
    for (let equipement of typeEquipement.equipements) {
      if (equipement.linked === true) {
        try {
          await postZoneEquipement({
            zoneId: zoneId,
            equipementId: equipement.id,
            actif: true,
          })
        } catch (e) {}
      } else if (equipement.linked === false) {
        for (let ze of equipement.zoneEquipements) {
          if (ze.zone.id == zoneId) {
            try {
              await deleteZoneEquipement(ze.id)
            } catch (e) {}
          }
        }
      }
    }
  }
}
</script>
