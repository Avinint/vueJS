<template>
  <Card>
    <h1>Activités par zone</h1>
    <div class="p-10">
      <Card v-for="(zoneFit, zoneIdx) of zones" class="mb-10 space-y-3">
        <h2>{{ zoneFit.libelle }}</h2>

        <div class="relative overflow-x-auto">
          <table
            class="w-full text-left text-sm text-gray-500"
          >
            <thead
              class="text-xs uppercase text-gray-700"
            >
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3">Actif</th>
                <th scope="col" class="px-6 py-3">Libellé</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(act, i) in zoneFit.zoneActivites" class="bg-white">
                <td class="flex items-center justify-center p-3">
                  <Button
                    test="TdeleteClient"
                    borderless
                    icon="delete"
                    couleur="secondary"
                    @click="removeActiviteZone(zoneFit.id, act.activite.id)"
                  />
                  <Button
                    test="TeditClient"
                    borderless
                    icon="edit"
                    couleur="secondary"
                    @click="editActiviteZone(act.id)"
                  />
                </td>
                <td class="px-6 py-4">
                  <label
                    class="relative inline-flex cursor-pointer items-center"
                  >
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
                      class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    ></span>
                  </label>
                </td>
                <td class="px-6 py-4">{{ act.activite.libelle }}</td>

                <td class="px-6 py-4">
                  <Button
                    label="Détails"
                    couleur="secondary"
                    @click="showActiviteZone(act.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button
          id="TaddActivite"
          label="Ajouter une Activité"
          icon="add"
          couleur="secondary"
          @click="addActiviteZone(zoneIdx)"
        />
      </Card>

      <form @submit.prevent="saveActiviteZone">
        <Modal
          v-if="activiteZone_modal"
          :type="readonly ? 'visualiser' : 'classic'"
          :title="modal_title"
          @cancel=";(activiteZone_modal = false), cancel()"
        >
          <div>
            <label for="select_activites" class="mr-4">Activité</label>
            <select
              id="select_activites"
              v-model="activite_selected"
              :disabled="readonly || activiteZone_selected"
              class="w-3/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option v-for="act of activites" :value="act.id">
                {{ act.libelle }}
              </option>
            </select>
          </div>

          <div class="flex items-center">
            <div class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
              {{ parametre_config_equipements_motorises?.libelle }}
            </div>
            <div>
              <InputRadio
                v-model="mode_equipements_motorises"
                :disabled="readonly"
                name="mode_equipements_motorises"
                :list="modes_motorise"
              />
            </div>
          </div>

          <div class="flex items-center">
            <div class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
              {{ parametre_mode_ecran_interface_video_scoring?.libelle }}
            </div>
            <div>
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
            </div>
          </div>

          <div class="flex items-center">
            <div class="mr-4">Division en sous-zones</div>
            <div
              class="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-300"
            >
              {{ sous_zones.length }}
            </div>
            <div class="text-sm text-blue-300">
              Sous-zone : surface réservable par les utilisateurs (= terrain)
            </div>
          </div>

          <NewSousZone
            v-if="!readonly"
            @valid-sous-zone="newSousZone($event)"
          />

          <template v-for="(sous_zone, idx) in sous_zones">
            <div
              v-if="!sous_zone.toRemove"
              class="rounded-md border border-gray-300 p-4"
            >
              <div>Sous-Zone {{ sous_zone.libelle }}</div>
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
              <div>
                <Button
                  v-if="!readonly"
                  borderless
                  icon="delete"
                  couleur="secondary"
                  @click="removeSousZone(idx)"
                />
              </div>
            </div>
          </template>
        </Modal>
      </form>
    </div>

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
import { onMounted, ref, computed, watch } from 'vue'
import { toast } from 'vue3-toastify'

import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
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

async function fetchDonnees() {
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
  activites.value = await getActivites(props.id)
}

onMounted(async () => {
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
  await fetchZoneEquipements()
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
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
}

const editActiviteZone = async (i) => {
  const activiteZoneTemp = await getActiviteByZone(i)
  await mapApiToData(activiteZoneTemp)
  modal_title.value =
    'Modifier une activité de la zone ' + activiteZoneTemp.zone.libelle
  readonly.value = false
  activiteZone_modal.value = true
}

const showActiviteZone = async (i) => {
  const activiteZoneTemp = await getActiviteByZone(i)
  await mapApiToData(activiteZoneTemp)
  modal_title.value = 'Information de la zone ' + activiteZoneTemp.zone.libelle
  readonly.value = true
  activiteZone_modal.value = true
}

// récupération de la liste des sous-zones d'une zone+activité
const getSousZones = async (zoneId, activiteId) => {
  const sousZones = []
  const data = await getZones(
    1,
    '&zoneParent=' + zoneId + '&zoneActivites.activite.id=' + activiteId
  )
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
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
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
