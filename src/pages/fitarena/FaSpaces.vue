<template>
  <Card class="space-y-3">
    <h1>Espaces</h1>

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="text-xs text-gray-700 bg-gray-200"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Statut</th>
            <th scope="col" class="px-6 py-3">Espace</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(esp, i) in espaces" :key="`spaces-`+ i" class="bg-white">
            <td class="px-6 py-4 flex gap-4">
              <p class="w-16">{{ esp.actif ? 'Actif' : 'Inactif' }}</p>
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="esp.actif"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifieEspace(esp)"
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
            <td class="flex items-center justify-end p-3 gap-10">
              <div @click="showEspace(i)" class="cursor-pointer px-3 py-2">
                <img src="/src/assets/info.svg" />
              </div>
              <Button
                test="TeditEspace"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editEspace(i)"
              />
              <Button
                test="TdeleteEspace"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeEspace(esp.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ButtonRight
      id="TaddEspace"
      label="Ajouter un espace"
      icon="add"
      couleur="danger"
      @click="addEspace"
    />
  </Card>

  <form @submit.prevent="saveEspace">
    <Modal
      v-if="espace_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="espace_modal = false"
      confirm-button-text="Enregistrer"
    >
      <div class="pl-4">
        <div class="flex items-center pb-6">
          <Input
            id="TEspaceLibelle"
            v-model="espace.libelle"
            :readonly="readonly"
            type="text"
            label="Nom"
            required
          />
        </div>
        <AjoutEquipements
          ref="ajoutEquipementsNume"
          type-equipement="numerique"
          :fa="props.id"
          :zone="id_selected"
          :readonly="readonly"
        ></AjoutEquipements>
        <AjoutEquipements
          ref="ajoutEquipementsMoto"
          type-equipement="motorise"
          :fa="props.id"
          :zone="id_selected"
          :readonly="readonly"
        ></AjoutEquipements>
        <MentionChampsObligatoires />
      </div>
    </Modal>
  </form>

  <form @submit.prevent="deleteSpaceValidation(deleteSpaceId)">
    <ValidationModal
      v-if="delete_modal"
      type="delete"
      @cancel="delete_modal = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateSpaceValidation()">
    <ValidationModal v-if="edit_modal" type="edit" @cancel="edit_modal = false">
    </ValidationModal>
  </form>

  <form @submit.prevent="addSpaceValidation()">
    <ValidationModal v-if="add_modal" type="add" @cancel="add_modal = false">
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import ButtonRight from '../../components/common/ButtonRight.vue'
import Input from '../../components/common/Input.vue'
import AjoutEquipements from '../../components/faZones/ajoutEquipement.vue'
import {
  deleteZones,
  getZones,
  postZones,
  updateZones,
  patchZones,
} from '../../api/zone.js'
import {
  deleteZoneEquipement,
  postZoneEquipement,
} from '../../api/zoneEquipement.js'
import { getTypeZone } from '../../api/typeZone.js'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

const props = defineProps(['id'])

const delete_modal = ref(false)
const deleteSpaceId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const espTemp = ref({})

const espace_modal = ref(false)
const readonly = ref(false)

const modal_title = ref('')
const id_selected = ref(0)
const espaces = ref([])
const typeZones = ref([])
const espace = ref({})
const espace_selected = ref({})
const ajoutEquipementsNume = ref()
const ajoutEquipementsMoto = ref()

const fetchDonnees = async() => {
  espaces.value = await getZones({ page: 1, 'typeZone.code': 'espace', fitArena: props.id })
}

onMounted(async () => {
 await fetchDonnees()
  typeZones.value = await getTypeZone()
})

watch(() => props.id, async() => await fetchDonnees())

const addEspace = () => {
  cancel()
  espace_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un espace'
}

const removeEspace = (id) => {
  deleteSpaceId.value = id
  delete_modal.value = true
}

const deleteSpaceValidation = async (id) => {
  try {
    await deleteZones(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  delete_modal.value = false
  deleteSpaceId.value = 0
  cancel()
  espaces.value = await getZones({ page: 1, 'typeZone.code': 'espace', fitArena: props.id })
  espace_modal.value = false
}

const modifieEspace = async ({ actif, id }) => {
  try {
    await patchZones({ actif }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const editEspace = (i) => {
  const espaceTemp = espaces.value[i]
  mapApiToData(espaceTemp)
  espace_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier un espace'
}

const showEspace = async (i) => {
  const espaceTemp = espaces.value[i]
  mapApiToData(espaceTemp)
  espace_modal.value = true
  readonly.value = true
  modal_title.value = "Informations d'un espace"
}

const mapApiToData = (espaceTemp) => {
  espace.value = espaceTemp
  id_selected.value = espaceTemp.id
}

const saveEspace = async () => {
  const espaceTemp = await getTypeZone(1, '&code=espace')

  espTemp.value = {
    typeZone: '/api/type_zones/' + espaceTemp[0].id,
    fitArena: '/api/fit_arenas/' + props.id,
    ordre: parseInt(espace.value.ordre),
    libelle: espace.value.libelle,
    actif: espace.value.actif == true ? espace.value.actif : false,
  }

  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateSpaceValidation = async () => {
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
  espace_modal.value = false
  cancel()
  espaces.value = await getZones({ page: 1, 'typeZone.code': 'espace', fitArena: props.id })
  typeZones.value = await getTypeZone()
}

const addSpaceValidation = async () => {
  try {
    const data = await postZones(espTemp.value)
    await linkedEquipements(ajoutEquipementsNume.value.typeEquipements, data.id)
    await linkedEquipements(ajoutEquipementsMoto.value.typeEquipements, data.id)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  espace_modal.value = false
  cancel()
  espaces.value = await getZones({ page: 1, 'typeZone.code': 'espace', fitArena: props.id })
  typeZones.value = await getTypeZone()
}

const cancel = () => {
  espace.value = {}
  espace_selected.value = {}
  espTemp.value = {}
  readonly.value = false
  id_selected.value = 0
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
