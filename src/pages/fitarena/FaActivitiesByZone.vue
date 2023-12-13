<template>
  <Spinner v-if="spinner" />

  <Card v-if="!spinner">
    <h1 class="mb-6">Activités par zone</h1>
    <div v-for="(zoneFit, zoneIdx) of zones" :key="`zone-`+ zoneIdx">
      <CardModalSection :title="zoneFit.libelle" class="border border-gray-200 pr-6 py-6 rounded-lg mb-6">
        <template #content>
          <div class="pl-8">
            <table class="w-full text-left text-sm text-gray-500 border border-gray-200 mb-6">
              <thead
                class="text-xs text-gray-700 bg-gray-200"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Statut</th>
                  <th scope="col" class="px-6 py-3">Libellé</th>
                  <th scope="col" class="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(act, i) in zoneFit.zoneActivites" :key="`zoneAct-`+ i" class="bg-white">
                  <td class="px-6 py-4 flex gap-4">
                    <p class="w-16">{{ act.statut ? 'Actif' : 'Inactif' }}</p>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="act.actif"
                        type="checkbox"
                        value="true"
                        class="peer sr-only"
                        @change="modifieActivite(act)"
                      />
                      <div
                        class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                      ></div>
                      <span
                        class="ml-3 text-sm font-medium text-gray-900"
                      ></span>
                    </label>
                  </td>
                  <td class="px-6 py-4">{{ act.activite.libelle }}</td>
                  <td class="flex items-center justify-end p-3 gap-8">
                    <Button
                      test="TshowZoneActivite"
                      borderless
                      icon="info"
                      couleur="secondary"
                      @click="showActiviteZone(act.id)"
                    />
                    <Button
                      test="TeditZoneActivite"
                      borderless
                      icon="edit"
                      couleur="secondary"
                      @click="editActiviteZone(act.id)"
                    />
                    <Button
                      test="TdeleteZoneActivite"
                      borderless
                      icon="delete"
                      couleur="secondary"
                      @click="removeActiviteZone(zoneFit.id, act.activite.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <ButtonRight
              id="TaddActivite"
              label="Ajouter une activité à la zone"
              icon="add"
              couleur="danger"
              @click="addActiviteZone(zoneIdx)"
            />
          </div>
        </template>
      </CardModalSection>
    </div>

    <form @submit.prevent="saveActiviteZone">
      <Modal
        v-if="activiteZone_modal"
        :type="readonly ? 'visualiser' : 'classic'"
        :title="modal_title"
        @cancel="(activiteZone_modal = false), cancel()"
        size="4xl"
        confirmButtonText="Enregistrer"
      >
        <Spinner v-if="spinner_modal" />

        <div v-if="!spinner_modal" class="pl-4">
          <table id="modal" class="w-full text-left text-sm mb-4 text-gray-500 border border-gray-200">
            <thead
              class="hidden"
            >
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Activités</td>
                <td>
                  <select
                    id="select_activites"
                    v-model="activite_selected"
                    :disabled="readonly || activiteZone_selected"
                    class="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option v-for="act of activites" :value="act.id" :key="act.id">
                      {{ act.libelle }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Config des équipements motorisés</td>
                <td>
                  <InputRadio
                    v-model="mode_equipements_motorises"
                    :disabled="readonly"
                    name="mode_equipements_motorises"
                    :list="modes_motorise"
                  />
                </td>
              </tr>
              <tr>
                <td >Mode d'écran géant et d'interface de vidéo et scoring</td>
                <td>
                  <InputRadio
                    v-model="mode_ecran_interface"
                    :default="{
                      label: 'Aucun',
                      value: 0,
                    }"
                    :disabled="readonly == true ? true : false"
                    name="mode_ecran_interface"
                    :list="modes_numerique"
                  />
                </td>
              </tr>
              <tr>
                <td>Division en sous-zones</td>
                <td class="flex items-center text-black">
                  <div
                    class="mr-4 flex h-8 w-8 items-center justify-center rounded-md bg-slate-300"
                  >
                    {{ sous_zones.length }}
                  </div>
                  <p class="text-sm text-blue-600">
                    Sous-zone : surface réservable par les utilisateurs (= terrain)
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <NewSousZone
            v-if="!readonly"
            @valid-sous-zone="newSousZone($event)"
          />
          <template v-for="(sous_zone, idx) in sous_zones" :key="`sous-zone_`+ idx">
            <CardModalSection v-if="!sous_zone.toRemove" :title="`Sous-zone ` + sous_zone.libelle" :params="true" class="mt-8">
              <template #topParams>
                <Button
                  v-if="!readonly"
                  borderless
                  icon="delete"
                  couleur="secondary"
                  @click="removeSousZone(idx)"
                  class="ml-10"
                />
              </template>
              <template #content>
                <div>
                  <div>
                    <ParamSousZone
                      v-if="zoneEquipementsByType[zone_selected]"
                      :i="idx"
                      :sous-zone-id="sous_zone.id"
                      :parametres="sousZoneParametres"
                      :parametre-valeurs="
                        getParametreValeurs(sous_zone, activite_selected)
                      "
                      :zone-equipements-by-type="
                        zoneEquipementsByType[zone_selected]
                      "
                      :sous-zone-equipements="
                        getEquipementsSousZone(sous_zone, activite_selected)
                      "
                      :readonly="readonly"
                      @change-param-value="changeParamValueSousZone($event)"
                      @change-equipements="changeEquipementsSousZone($event)"
                    />
                  </div>
                </div>
              </template>
            </CardModalSection>
          </template>
        </div>
      </Modal>
    </form>
    
    <form
      @submit.prevent="deleteActivityValidation(deleteZoneId, deleteActivityId)"
    >
      <ValidationModal
        v-if="delete_modal"
        type="delete"
        @cancel="delete_modal = false"
      >
      </ValidationModal>
    </form>

    <form @submit.prevent="updateActivityValidation()">
      <ValidationModal
        v-if="edit_modal"
        type="edit"
        @cancel="edit_modal = false"
      >
      </ValidationModal>
    </form>

    <form @submit.prevent="addActivityValidation()">
      <ValidationModal v-if="add_modal" type="add" @cancel="add_modal = false">
      </ValidationModal>
    </form>
  </Card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

import Card from '../../components/common/Card.vue'
import Spinner from '../../components/common/Spinner.vue'
import Modal from '../../components/common/Modal.vue'
import CardModalSection from '../../components/common/CardModalSection.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import ButtonRight from '../../components/common/ButtonRight.vue'
import Input from '../../components/common/Input.vue'
import Select from '../../components/common/Select.vue'
import InputRadio from '../../components/common/InputRadio.vue'
import ParamSousZone from '../../components/faActivitesByZone/paramSousZone.vue'
import NewSousZone from '../../components/faActivitesByZone/newSousZone.vue'

import {
  getActiviteByZone,
  patchActivitesByZones,
  postZoneActivite,
  deleteZoneActivite,
} from '../../api/activiteByZone.js'
import { getZones, deleteZones } from '../../api/zone.js'
import { getModes } from '../../api/mode.js'
import { getParametres } from '../../api/parametre.js'
import { getTypeZone } from '../../api/typeZone.js'
import { getParametreZoneActivites } from '../../api/parametreZoneActivite.js'
import { getEquipementsByZone } from '../../api/equipement.js'
import { getActivites } from '../../api/activite.ts'
import { postSousZone } from '../../api/sousZone.js'
import { postConfigurationZoneActivite } from '../../api/configuration.js'

const props = defineProps(['id'])

const activiteZone_modal = ref(false)
const readonly = ref(false)
const zones = ref([])
const activiteZone_selected = ref(0)
const activites = ref([])
const modal_title = ref('')
const zone_selected = ref(0)
const activite_selected = ref(0)
const modes_motorise = ref([])
const modes_numerique = ref([])
const mode_equipements_motorises = ref(0)
const mode_ecran_interface = ref(0)
const parametre_config_equipements_motorises = ref({})
const parametre_mode_ecran_interface_video_scoring = ref({})
const sous_zones = ref([])
const id_type_sous_zone = ref(0)
const sousZoneParametres = ref({})
const zoneEquipementsByType = ref({})
const delete_modal = ref(false)
const deleteActivityId = ref(0)
const deleteZoneId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const zoneTemp = ref({})
const spinner = ref(false)
const spinner_modal = ref(false)

async function fetchDonnees() {
  zones.value = await getZones({ page: 1, 'order[ordre]': 'asc', 'typeZone.code': 'zone', fitArena: props.id })
  activites.value = await getActivites(props.id)
  await fetchZoneEquipements()
}

onMounted(async () => {
  spinner.value = true
  await fetchDonnees();
  modes_motorise.value = await getModes({ 'categoryTypeEquipement.code': 'motorise' })
  modes_numerique.value = await getModes({ 'categoryTypeEquipement.code': 'numerique' })
  parametre_config_equipements_motorises.value = (
    await getParametres({page: 1, code: 'config_des_equipements_motorises'})
  ).shift()
  parametre_mode_ecran_interface_video_scoring.value = (
    await getParametres({page: 1, code: 'mode_d_ecran_geant_et_d_interface_de_video_et_scoring'}
    )
  ).shift()
  let data = await getTypeZone(1, '&code=sous_zone')
  id_type_sous_zone.value = data[0]?.id
  await fetchSousZoneParametres()
  spinner.value = false
})

watch(() => props.id, () => fetchDonnees())

const modifieActivite = async ({ actif, id }) => {
  try {
    await patchActivitesByZones({ actif }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const cancel = () => {
  zone_selected.value = 0
  activite_selected.value = 0
  activiteZone_selected.value = 0
  deleteActivityId.value = 0
  deleteZoneId.value = 0
  sous_zones.value = []
}

const mapApiToData = async (activiteZoneTemp) => {
  activiteZone_selected.value = activiteZoneTemp.id
  activite_selected.value = activiteZoneTemp.activite.id
  zone_selected.value = activiteZoneTemp.zone.id

  // récupération des valeurs des paramètres nécessaires
  mode_equipements_motorises.value = modes_motorise.value[0].id
  mode_ecran_interface.value = 0
  let data = await getParametreZoneActivites(
    1,
    '&zoneActivite=' + activiteZone_selected.value
  )
  data.forEach((datum) => {
    switch (datum.parametre.id) {
      case parametre_config_equipements_motorises.value.id:
        mode_equipements_motorises.value = datum.valeur
        break
      case parametre_mode_ecran_interface_video_scoring.value.id:
        mode_ecran_interface.value = datum.valeur
        break
    }
  })

  sous_zones.value = await getSousZones(
    zone_selected.value,
    activite_selected.value
  )
}

const addActiviteZone = async (zoneIdx) => {
  activiteZone_selected.value = 0
  const zone = zones.value[zoneIdx]
  zone_selected.value = zone.id
  // activite_selected.value = activites.value[0].id;
  modal_title.value = 'Ajouter une activité à la zone ' + zone.libelle
  mode_equipements_motorises.value = modes_motorise.value[0].id // sélection obligatoire, on présélectionne le 1er mode
  mode_ecran_interface.value = 0 // sélection optionnelle
  readonly.value = false
  activiteZone_modal.value = true

  sous_zones.value = await getSousZones(
    zone_selected.value,
    activite_selected.value
  )
}

const removeActiviteZone = async (zoneId, activiteId) => {
  deleteActivityId.value = activiteId
  deleteZoneId.value = zoneId
  delete_modal.value = true
}

const deleteActivityValidation = async (zoneId, activiteId) => {
  try {
    await deleteZoneActivite(zoneId, activiteId)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
  cancel()
  activiteZone_modal.value = false
  delete_modal.value = false
  zones.value = await getZones({ page: 1, 'order[ordre]': 'asc', 'typeZone.code': 'zone', fitArena: props.id })
}

const editActiviteZone = async (i) => {
  spinner_modal.value = true
  activiteZone_modal.value = true
  const activiteZoneTemp = await getActiviteByZone(i)
  await mapApiToData(activiteZoneTemp)
  modal_title.value =
    'Modifier une activité de la zone ' + activiteZoneTemp.zone.libelle
  readonly.value = false
  spinner_modal.value = false
}

const showActiviteZone = async (i) => {
  activiteZone_modal.value = true
  spinner_modal.value = true
  const activiteZoneTemp = await getActiviteByZone(i)
  await mapApiToData(activiteZoneTemp)
  modal_title.value = 'Information de la zone ' + activiteZoneTemp.zone.libelle
  readonly.value = true
  spinner_modal.value = false
}

// récupération de la liste des sous-zones d'une zone+activité
const getSousZones = async (zoneId, activiteId) => {
  const sousZones = []
  const data = await getZones({ page: 1, 'order[ordre]': 'asc', 'zoneParent': zoneId, 'zoneActivites.activite.id': activiteId })

  data.forEach((datum) => {
    sousZones.push(datum)
  })
  return sousZones
}

const saveActiviteZone = async () => {
  zoneTemp.value = {
    actif: true,
    ordre: 0,
    parametres: [
      {
        id: parametre_config_equipements_motorises.value.id,
        codeParametre: parametre_config_equipements_motorises.value.code,
        valeur: mode_equipements_motorises.value,
      },
      {
        id: parametre_mode_ecran_interface_video_scoring.value.id,
        codeParametre: parametre_mode_ecran_interface_video_scoring.value.code,
        valeur: mode_ecran_interface.value,
      },
    ],
  }

  if (modal_title.value.includes('Modifier')) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateActivityValidation = async () => {
  activityValidation(
    'Modification effectuée avec succès',
    'Une erreur est survenue'
  )
}

const addActivityValidation = async () => {
  activityValidation('Ajout effectué avec succès', 'Une erreur est survenue')
}

const activityValidation = async (msgOk, msgNoOk) => {
  try {
    await postZoneActivite(
      zone_selected.value,
      activite_selected.value,
      zoneTemp.value
    )
    await saveSousZones(zone_selected.value, activite_selected.value)
    toast.success(msgOk)
  } catch (e) {
    toast.error(msgNoOk)
  }

  edit_modal.value = false
  add_modal.value = false
  activiteZone_modal.value = false
  cancel()
  zones.value = await getZones({ page: 1, 'order[ordre]': 'asc', 'typeZone.code': 'zone', fitArena: props.id })
}

const newSousZone = (libelle) => {
  sous_zones.value.push({
    type: id_type_sous_zone.value,
    libelle,
    actif: true,
    ordre: 1,
    isNew: true,
    zoneActivites: [
      {
        activite: {
          id: activite_selected.value,
        },
        parametreZoneActivites: [],
        zoneActiviteEquipements: [],
      },
    ],
  })
}

const saveSousZones = async (zoneId, activiteId) => {
  for (let {
    isNew,
    toRemove,
    actif,
    ordre,
    libelle,
    id,
    zoneActivites,
  } of sous_zones.value) {
    if (toRemove) {
      await deleteZones(id)
    } else {
      const zoneActivite = zoneActivites
        .filter((za) => za.activite.id == activiteId)
        .shift()

      const parametres = []
      zoneActivite.parametreZoneActivites.forEach((param) => {
        parametres.push({
          id: param.parametre.id,
          valeur: param.valeur,
          code: param.parametre.code
        })
      })
      const equipements = []
      zoneActivite.zoneActiviteEquipements.forEach((equip) => {
        equipements.push({
          id: equip.equipement.id,
        })
      })

      if (isNew) {
        await postSousZone(zoneId, activiteId, {
          actif,
          ordre,
          libelle,
          parametres,
          equipements,
          fitArena: parseInt(props.id)
        })
      } else {
        await postConfigurationZoneActivite(id, activiteId, {
          parametres,
          equipements,
        })
      }
    }
  }
}

const removeSousZone = async (index) => {
  const sousZone = sous_zones.value[index]
  // on peut supprimer dans la liste une zone pas encore créée en base
  if (sousZone.isNew) {
    sousZone.toRemove = true
    sous_zones.value.splice(index, 1)
  } else {
    sousZone.toRemove = true
  }
}

// récupération des info de base des paramètres nécessaires (globaux, pas par rapport à une sous-zone)
// TODO: en passant par 1 store, on pourra déporter ça directement vers le composant paramSousZone
const fetchSousZoneParametres = async () => {
  const parametreNombreParticipantsMax = (
    await getParametres({page: 1, code: 'nombre_de_participants_max'})
  ).shift()
  const parametreNombreParticipantsConseille = (
    await getParametres({page: 1, code: 'nombre_de_participants_conseille'})
  ).shift()

  sousZoneParametres.value = {
    nombreParticipantsMax: parametreNombreParticipantsMax,
    nombreParticipantsConseille: parametreNombreParticipantsConseille,
  }
}

// récupération des équipements de la zone par type
const fetchZoneEquipements = async () => {
  for (let zone of zones.value) {
    const equipementsTypeTablette = (
      await getEquipementsByZone(
        1,
        zone.id,
        '&equipement.typeEquipement.code=tablette'
      )
    ).map((elt) => {
      return elt.equipement
    })
    const equipementsTypeEcran = (
      await getEquipementsByZone(
        1,
        zone.id,
        '&equipement.typeEquipement.code[]=ecran_geant&equipement.typeEquipement.code[]=ecran_attente&equipement.typeEquipement.code[]=ecran_accueil'
      )
    ).map((elt) => {
      return elt.equipement
    })
    const equipementsTypeCamera = (
      await getEquipementsByZone(
        1,
        zone.id,
        '&equipement.typeEquipement.code=camera'
      )
    ).map((elt) => {
      return elt.equipement
    })
    const equipementsTypeSono = (
      await getEquipementsByZone(
        1,
        zone.id,
        '&equipement.typeEquipement.code=sonorisation'
      )
    ).map((elt) => {
      return elt.equipement
    })

    zoneEquipementsByType.value[zone.id] = {
      tablette: equipementsTypeTablette,
      ecran: equipementsTypeEcran,
      camera: equipementsTypeCamera,
      sonorisation: equipementsTypeSono,
    }
  }
}

const getParametreValeurs = (sousZone, activiteId) => {
  const za = sousZone.zoneActivites
    ?.filter((e) => e.activite.id == activiteId)
    .shift()
  if (!za) {
    return []
  }
  return za.parametreZoneActivites.map((elt) => {
    return {
      parametreId: elt.parametre.id,
      valeur: elt.valeur,
    }
  })
}

const changeParamValueSousZone = (e) => {
  const sousZone = sous_zones.value[e.idx]
  const za =
    sousZone &&
    sousZone.zoneActivites
      .filter((za) => za.activite.id == activite_selected.value)
      .shift()
  if (!za.parametreZoneActivites) {
    za.parametreZoneActivites = []
  }
  const param = za.parametreZoneActivites
    .filter((p) => p.parametre.id == e.parametreId)
    .shift()
  if (param) {
    param.valeur = e.valeur
  } else {
    // le param n'existe pas encore
    za.parametreZoneActivites.push({
      parametre: { id: e.parametreId },
      valeur: e.valeur,
    })
  }
}

const getEquipementsSousZone = (sousZone, activiteId) => {
  const equipementsSelection = []
  const za = sousZone.zoneActivites
    .filter((e) => e.activite.id == activiteId)
    .shift()
  za &&
    za.zoneActiviteEquipements.forEach((elt) => {
      equipementsSelection.push(elt.equipement.id)
    })
  return equipementsSelection
}

const changeEquipementsSousZone = (e) => {
  const sousZone = sous_zones.value[e.idx]
  const za =
    sousZone &&
    sousZone.zoneActivites
      ?.filter((za) => za.activite.id == activite_selected.value)
      .shift()
  if (!za.zoneActiviteEquipements) {
    za.zoneActiviteEquipements = []
  }
  za.zoneActiviteEquipements.length = 0
  e.equipementIds.forEach((id) => {
    za.zoneActiviteEquipements.push({
      equipement: { id },
    })
  })
}
</script>

<style scoped>
table#modal tr {
  font-weight: 700;
  border: 1px solid lightgray;
}
table#modal tr > td:first-of-type {
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
  border-right: 1px solid lightgray;
  color: #000;
}

table#modal tr > td {
  padding: 0.5rem;
}

table#modal {
  border-radius: 30px;
}
</style>