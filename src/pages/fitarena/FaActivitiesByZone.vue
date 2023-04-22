<template>
  <Card>
    <h1>Activités par zone</h1>
    <div class="p-10">
      <Card
        v-for="(zoneFit, zoneIdx) of zones"
        :key="zoneIdx"
        class="mb-10 space-y-3"
      >
        <h2>{{ zoneFit.libelle }}</h2>

        <div class="relative overflow-x-auto">
          <table
            class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3">Actif</th>
                <th scope="col" class="px-6 py-3">Libellé</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(act, i) in zoneFit.zoneActivites"
                :key="i"
                class="bg-white"
              >
                <td class="flex items-center justify-center p-3">
                  <Button
                    test="TdeleteClient"
                    borderless
                    icon="delete"
                    type="secondary"
                    @click="removeActiviteZone(act.id)"
                  />
                  <Button
                    test="TeditClient"
                    borderless
                    icon="edit"
                    type="secondary"
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
                      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
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
                    type="secondary"
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
          type="secondary"
          @click="addActiviteZone(zoneIdx)"
        />
      </Card>

      <form @submit.prevent="saveActiviteZone">
        <Modal
          v-if="activiteZone_modal"
          :type="readonly ? 'visualiser' : 'classic'"
          :title="modal_title"
          @cancel="activiteZone_modal = false"
        >
          <div class="flex items-center">
            <label
              for="select_activites"
              class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
              >Activité</label
            >
            <select
              id="select_activites"
              v-model="activite_selected"
              :disabled="readonly == true ? true : false"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option v-for="act of activites" :key="act.id" :value="act.id">
                {{ act.libelle }}
              </option>
            </select>
          </div>

          <div class="flex items-center">
            <div class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
              {{ parametre_config_equipements_motorises.libelle }}
            </div>
            <div>
              <InputRadio
                v-model="mode_equipements_motorises"
                :disabled="readonly == true ? true : false"
                name="mode_equipements_motorises"
                :list="modes_motorise"
              />
            </div>
          </div>

          <div class="flex items-center">
            <div class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
              {{ parametre_mode_ecran_interface_video_scoring.libelle }}
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
            <div class="text-light-blue text-sm">
              Sous-zone : surface réservable par les utilisateurs (= terrain)
            </div>
          </div>

          <Button
            v-if="!new_sous_zone && !readonly"
            id="TaddSousZone"
            label="Ajouter une Sous-zone"
            icon="add"
            type="secondary"
            @click="addSousZone()"
          />

          <div
            v-if="new_sous_zone"
            class="rounded-md border border-gray-300 p-4"
          >
            <div>
              <Input
                id="new_sous_zone_libelle"
                v-model="new_sous_zone_libelle"
                label="Nom de la sous-zone"
                type="text"
              />
            </div>
            <div class="mt-4 text-center">
              <Button
                label="Valider"
                icon=""
                class="mr-4"
                type="secondary"
                @click="validSousZone()"
              ></Button>
              <Button
                label="Annuler"
                icon=""
                class=""
                type="secondary"
                @click="new_sous_zone = false"
              ></Button>
            </div>
          </div>

          <template v-for="(sous_zone, idx) in sous_zones" :key="idx">
            <div
              v-if="!sous_zone.toRemove"
              class="rounded-md border border-gray-300 p-4"
            >
              <div>Sous-Zone {{ sous_zone.libelle }}</div>
              <div>
                <ParamSousZone
                  v-if="zoneEquipementsByType[zone_selected]"
                  :i="idx"
                  :zone="zone_selected"
                  :activite="activite_selected"
                  :sous-zone="sous_zone"
                  :sous-zone-parametres="sousZoneParametres"
                  :zone-equipements-by-type="
                    zoneEquipementsByType[zone_selected]
                  "
                  :readonly="readonly"
                  @changeEquipement="changeEquipementSousZone"
                />
              </div>
              <div>
                <Button
                  v-if="!readonly"
                  borderless
                  icon="delete"
                  type="secondary"
                  @click="removeSousZone(idx)"
                />
              </div>
            </div>
          </template>
        </Modal>
      </form>
    </div>

    <form @submit.prevent="deleteActivityValidation(deleteActivityId)">
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
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import Input from '../../components/common/Input.vue'
import InputRadio from '../../components/common/InputRadio.vue'
import ParamSousZone from '../../components/faActivitesByZone/paramSousZone.vue'
import {
  deleteActivitesByZones,
  getActiviteByZone,
  patchActivitesByZones,
  postZoneActivite,
} from '../../api/activiteByZone.js'
import { getZones, deleteZones } from '../../api/zone.js'
import { getModes } from '../../api/mode.js'
import {
  getParametres,
  postParametres,
  updateParametres,
} from '../../api/parametre.js'
import { getTypeZone } from '../../api/typeZone.js'
import { getParametreZoneActivites } from '../../api/parametreZoneActivite.js'
import { getEquipementsByZone } from '../../api/equipement.js'
import { getActivites } from '../../api/activite.js'
import { postZoneActiviteEquipement } from '../../api/zoneActiviteEquipement.js'
import { postSousZone } from '../../api/sousZone.js'
import { toast } from 'vue3-toastify'
import { onMounted, ref } from 'vue'

const props = defineProps(['id'])

const delete_modal = ref(false)
const deleteActivityId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const zoneTemp = ref({})

const activiteZone_modal = ref(false)
const readonly = ref(false)
const activiteZones = ref([])
const zones = ref([])
const activiteZone = ref({})
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
const new_sous_zone = ref(false)
const new_sous_zone_libelle = ref('')
const id_type_sous_zone = ref(0)

const sousZoneParametres = ref({})
const zoneEquipementsByType = ref({})
const sousZoneEquipements = []

onMounted(async () => {
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
  activites.value = await getActivites(props.id)
  modes_motorise.value = await getModes(
    1,
    '&categoryTypeEquipement.code=motorise'
  )
  modes_numerique.value = await getModes(
    1,
    '&categoryTypeEquipement.code=numerique'
  )
  parametre_config_equipements_motorises.value = (
    await getParametres(1, '&code=config-des-equipements-motorises')
  ).shift()
  parametre_mode_ecran_interface_video_scoring.value = (
    await getParametres(
      1,
      '&code=mode-d-ecran-geant-et-d-interface-de-video-et-scoring'
    )
  ).shift()
  let data = await getTypeZone(1, '&code=sous-zone')
  id_type_sous_zone.value = data[0]?.id
  await fetchSousZoneParametres()
  await fetchZoneEquipements()
})

const changeEquipementSousZone = (i, value) => {
  sousZoneEquipements[sous_zones.value[i].id] = value
}

const addActiviteZone = async (zoneIdx) => {
  activiteZone_selected.value = 0
  const zone = zones.value[zoneIdx]
  zone_selected.value = zone.id
  activite_selected.value = activites.value[0].id
  modal_title.value = 'Ajouter une activité à la zone ' + zone.libelle
  mode_equipements_motorises.value = modes_motorise.value[0].id
  mode_ecran_interface.value = 0
  readonly.value = false
  activiteZone_modal.value = true

  await sousZones(zone_selected.value, activite_selected.value)
}

const removeActiviteZone = (id) => {
  deleteActivityId.value = id
  delete_modal.value = true
}

const deleteActivityValidation = async (id) => {
  try {
    await deleteActivitesByZones(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  delete_modal.value = false
  deleteActivityId.value = 0
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
  activites.value = await getActivites(props.id)
  activiteZone_modal.value = false
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
  modal_title.value = 'Informations de la zone ' + activiteZoneTemp.zone.libelle
  readonly.value = true
  activiteZone_modal.value = true
}

const mapApiToData = async (activiteZoneTemp) => {
  activiteZone.value = activiteZoneTemp
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

  await sousZones(zone_selected.value, activite_selected.value)
}

// récupération de la liste des sous-zones
const sousZones = async (zoneId, activiteId) => {
  sous_zones.value = []
  let data = await getZones(
    1,
    '&zoneParent=' + zoneId + '&zoneActivites.activite.id=' + activiteId
  )
  data.forEach((datum) => {
    sous_zones.value.push(datum)
  })
}

const modifieActivite = async ({ actif, id }) => {
  try {
    await patchActivitesByZones({ actif }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
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
  try {
    await postZoneActivite(
      zone_selected.value,
      activite_selected.value,
      zoneTemp
    )
    await saveSousZones(zone_selected.value, activite_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  activiteZone_modal.value = false
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
  activites.value = await getActivites(props.id)
}

const addActivityValidation = async () => {
  try {
    await postZoneActivite(
      zone_selected.value,
      activite_selected.value,
      zoneTemp
    )
    await saveSousZones(zone_selected.value, activite_selected.value)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  activiteZone_modal.value = false
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena=' + props.id)
  activites.value = await getActivites(props.id)
}

const cancel = () => {
  zone_selected.value = 0
  activite_selected.value = 0
  activiteZone_selected.value = 0
  sous_zones.value = []
  new_sous_zone.value = false
}

const addSousZone = () => {
  new_sous_zone_libelle.value = ''
  new_sous_zone.value = true
}

const validSousZone = () => {
  new_sous_zone.value = false
  sous_zones.value.push({
    type: id_type_sous_zone.value,
    libelle: new_sous_zone_libelle.value,
    actif: true,
    ordre: 1,
    isNew: true,
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
    if (isNew) {
      await postSousZone(zone_selected.value, {
        actif,
        ordre,
        libelle,
      })
    } else if (toRemove) {
      // suppression
      await deleteZones(id)
    } else {
      // édition
      const zoneActivite = zoneActivites
        .filter((e) => e.activite.id == activite_selected.value)
        .shift()

      // parametres, on les a directement modifiés dans sous_zones...
      const parametres = zoneActivite.parametreZoneActivites
      let toUpdate = []
      let toPost = []
      for (let p of parametres) {
        const data = {
          parametre: p.parametre.id,
          valeur: p.valeur,
        }
        // si on a p = 0 c'est qu'on a modifié un paramètre qui n'existe pas en base
        // todo: il faudrait plutôt un post dans tous les cas, et on gère insertion ou maj côté backend
        if (p.id == 0) {
          toPost.push(data)
        } else {
          toUpdate.push(data)
        }
      }
      const data = {
        idZone: id,
        idActivite: activiteId,
        parametres: [],
      }
      if (toUpdate.length) {
        data.parametres = toUpdate
        await updateParametres(data)
      }
      if (toPost.length) {
        data.parametres = toPost
        await postParametres(data)
      }

      // équipements
      await postZoneActiviteEquipement(id, activite_selected.value, {
        equipements: Object.values(sousZoneEquipements[id]),
      })
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

// récupération des infos de base des paramètres nécessaires (globaux, pas par rapport à une sous-zone)
const fetchSousZoneParametres = async () => {
  const parametreNombreParticipantsMax = (
    await getParametres(1, '&code=nombre-de-participants-max')
  ).shift()
  const parametreNombreParticipantsConseille = (
    await getParametres(1, '&code=nombre-de-participants-conseille')
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
        '&equipement.typeEquipement.code[]=ecran-geant&equipement.typeEquipement.code[]=ecran-attente&equipement.typeEquipement.code[]=ecran-accueil'
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
</script>

<style scoped></style>
