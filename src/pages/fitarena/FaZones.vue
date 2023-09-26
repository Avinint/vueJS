<template>
  <Card>
    <h1>Zones</h1>
    <span class="text-sm font-bold"
      >Zones d'activité : ensemble de sous-zones délimitée physiquement sur
      lequel est praticable une seule activité en même temps
    </span>
    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="text-xs uppercase text-gray-700"
        >
          <tr>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3">Actif</th>
            <th scope="col" class="px-6 py-3">Libellé</th>
            <th scope="col" class="px-6 py-3">Ordre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(esp, i) in zones" :key="i" class="bg-white">
            <td class="flex items-center justify-center p-3">
              <Button
                test="TdeleteZone"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeZone(esp.id)"
              />
              <Button
                test="TeditZone"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editZone(i)"
              />
            </td>
            <td class="px-6 py-4">
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="esp.actif"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifieZone(esp)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
            </td>
            <td class="px-6 py-4">{{ esp.libelle }}</td>
            <td class="px-6 py-4">{{ esp.ordre }}</td>
            <td class="px-6 py-4">
              <Button label="Détails" couleur="secondary" @click="showZone(i)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Button
      id="TaddZone"
      label="Ajouter une zone"
      couleur="secondary"
      icon="add"
      @click="addZone"
    />
  </Card>

  <form @submit.prevent="saveZone">
    <Modal
      v-if="zone_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="(zone_modal = false), cancel()"
    >
      <div class="flex items-center">
        <Input
          id="TZoneLibelle"
          v-model="zone.libelle"
          :readonly="readonly"
          type="text"
          label="Nom"
          :inline="true"
          required
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Sous Espace</label
        >
        <select
          v-if="espaceParents.length"
          id="TfaSelectEspace"
          v-model="espace_selected"
          :disabled="readonly == true ? true : false"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
        <Input
          v-if="!readonly"
          id="TZoneOrdre"
          v-model="zone.ordre"
          type="number"
          label="Ordre"
          required
          :inline="true"
          class="w-full"
        />
        <Input
          v-else
          id="TZoneOrdre"
          v-model="zone.ordre"
          readonly
          type="text"
          label="Ordre"
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <span class="w-1/2 mr-3 text-sm font-medium text-gray-900"
          >Actif :
        </span>
        <label class="relative inline-flex w-full cursor-pointer items-center">
          <input
            v-model="zone.actif"
            :disabled="readonly == true ? true : false"
            type="checkbox"
            value="true"
            class="peer sr-only"
          />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900"
          ></span>
        </label>
      </div>
      <div>
        <AjoutEquipements
          ref="ajoutEquipementsNume"
          type-equipement="numerique"
          :fa="props.id"
          :zone="id_selected"
          :readonly="readonly"
        ></AjoutEquipements>
      </div>
      <div>
        <AjoutEquipements
          ref="ajoutEquipementsMoto"
          type-equipement="motorise"
          :fa="props.id"
          :zone="id_selected"
          :readonly="readonly"
        ></AjoutEquipements>
      </div>
      <MentionChampsObligatoires/>
    </Modal>
  </form>

  <form @submit.prevent="deleteZoneValidation(deleteZoneId)">
    <ValidationModal
      v-if="delete_modal"
      type="delete"
      @cancel="delete_modal = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateZoneValidation()">
    <ValidationModal v-if="edit_modal" type="edit" @cancel="edit_modal = false">
    </ValidationModal>
  </form>

  <form @submit.prevent="addZoneValidation()">
    <ValidationModal v-if="add_modal" type="add" @cancel="add_modal = false">
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import Input from '../../components/common/Input.vue'
import AjoutEquipements from '../../components/faZones/ajoutEquipement.vue'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue"

import {
  deleteZones,
  getZones,
  getZone,
  postZones,
  updateZones,
  patchZones,
} from '../../api/zone.js'
import {
  postZoneEquipement,
  deleteZoneEquipement,
} from '../../api/zoneEquipement.js'
import { getTypeZone } from '../../api/typeZone.js'

import { toast } from 'vue3-toastify'
import { onMounted, ref, watch } from 'vue'

const props = defineProps(['id'])

const zone_modal = ref(false)
const readonly = ref(false)
const delete_modal = ref(false)
const deleteZoneId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const espTemp = ref({})

const id_selected = ref(0)
const zones = ref([])
const zone = ref([])
const typeZones = ref([])
const espaceParents = ref([])
let espace_selected = ref({})
const modal_title = ref('')
const ajoutEquipementsNume = ref()
const ajoutEquipementsMoto = ref()

async function fetchDonnees() {
  zones.value = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: props.id })
  espaceParents.value = await getZones({ page: 1, 'typeZone.code': 'sous_espace', fitArena: props.id })
}

onMounted(async () => {
  await fetchDonnees()
  typeZones.value = await getTypeZone()
})

watch(() => props.id, async () => await fetchDonnees())

const addZone = () => {
  cancel()
  zone_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter une zone'
}

const removeZone = (id) => {
  deleteZoneId.value = id
  delete_modal.value = true
}

const deleteZoneValidation = async (id) => {
  try {
    await deleteZones(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  delete_modal.value = false
  deleteZoneId.value = 0
  cancel()
  zones.value = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: props.id })
  zone_modal.value = false
}

const modifieZone = async ({ actif, id }) => {
  try {
    await patchZones({ actif }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const editZone = (i) => {
  const zoneTemp = zones.value[i]
  mapApiToData(zoneTemp)
  zone_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier une zone'
}

const showZone = (i) => {
  const zoneTemp = zones.value[i]
  mapApiToData(zoneTemp)
  zone_modal.value = true
  readonly.value = true
  modal_title.value = "Informations d'une zone"
}

const mapApiToData = async (zoneTemp) => {
  await getZone(zoneTemp.id)
  // espace_selected.value = espaceParent.id
  zone.value = zoneTemp
  id_selected.value = zoneTemp.id
  // Je cherche l'espace parent s'il existe
}

const saveZone = async () => {
  const zoneTemp = await getTypeZone(1, '&code=zone')

  espTemp.value = {
    typeZone: '/api/type_zones/' + zoneTemp[0].id,
    fitArena: '/api/fit_arenas/' + props.id,
    ordre: parseInt(zone.value.ordre),
    libelle: zone.value.libelle,
    actif: zone.value.actif == true ? zone.value.actif : false,
    idZoneParent: espace_selected.value,
  }

  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateZoneValidation = async () => {
  try {
    await updateZones(espTemp.value, id_selected.value)
    await linkedEquipements(
      ajoutEquipementsNume.value.typeEquipements,
      id_selected.value
    )
    await linkedEquipements(
      ajoutEquipementsMoto.value.typeEquipements,
      id_selected.value
    )
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  zone_modal.value = false
  cancel()
  zones.value = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: props.id })
  espaceParents.value = await getZones({ page: 1, 'typeZone.code': 'espace', fitArena: props.id })
  typeZones.value = await getTypeZone()
}

const addZoneValidation = async () => {
  try {
    const data = await postZones(espTemp.value)
    await linkedEquipements(ajoutEquipementsNume.value.typeEquipements, data.id)
    await linkedEquipements(ajoutEquipementsMoto.value.typeEquipements, data.id)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  zone_modal.value = false
  cancel()
  zones.value = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: props.id })
  espaceParents.value = await getZones({ page: 1, 'typeZone.code': 'espace', fitArena: props.id })
  typeZones.value = await getTypeZone()
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

const cancel = () => {
  espace_selected.value = {}
  zone.value = {}
  readonly.value = false
  id_selected.value = 0
}
</script>
