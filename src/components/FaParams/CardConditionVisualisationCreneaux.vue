<template>
  <CardModalSection title="Condition de visualisation des créneaux" class="border border-gray-200 py-4 pr-4 rounded-lg">
    <div v-if="parametreFitArena" class="pl-8">
      <table id="view" class="param-fa w-full text-left text-sm mb-4 text-gray-500">
        <thead
          class="hidden"
        >
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nombre de jours visibles pour la réservation de créneaux par les utilisateurs GP</td>
            <td class="flex items-center gap-4">
              <p class="px-6 w-16">{{ parametreFitArena.actif ? 'Actif' : 'Inactif' }}</p>
              <label class="relative inline-flex cursor-pointer">
                <input
                  :checked="parametreFitArena.actif"
                  type="checkbox"
                  :value="parametreFitArena.actif"
                  class="peer sr-only"
                  @click="modificationStatus(parametreFitArena)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
              <p class="bg-grey mx-1 px-4 py-2 flex justify-end rounded-lg">{{ parametreFitArena.valeur }} jour{{ parametreFitArena.valeur > 1 ? 's' : '' }}</p>
            </td>
            <td>
              <Button
                test="TeditGPView"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editParDefaut(parametreFitArena)"
              />
            </td>
            <td></td>
          </tr>
          <template v-for="(parametre, index) in parametreFitArenaProfils?.[PARAM_NB_JOURS_VISIBLES_PROFIL] ?? {}" :key="index">
            <tr>
              <td>{{ parametre[0].parametre.libelle }}</td>
              <td class="flex items-center gap-4">
                <p class="px-6 w-16">{{ parametre[0].parametre.actif ? 'Actif' : 'Inactif' }}</p>
                <label class="relative inline-flex cursor-pointer">
                  <input
                    :checked="parametre[0].parametre.actif"
                    type="checkbox"
                    :value="parametre[0].parametre.actif"
                    class="peer sr-only"
                    @click="modificationStatusParProfils(parametre)"
                  />
                  <div
                    class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                  ></div>
                  <span
                    class="ml-3 text-sm font-medium text-gray-900"
                  ></span>
                </label>
                <p class="bg-grey mx-1 px-4 py-2 flex justify-end rounded-lg">{{ index }} jour{{ index > 1 ? 's' : '' }}</p>
              </td>
              <td>
                <Button
                  test="TeditKeyMoment"
                  borderless
                  icon="edit"
                  couleur="secondary"
                  @click="editAvecProfils(parametre)"
                />
              </td>
              <td>
                <Button
                  test="TdeleteKeyMoment"
                  borderless
                  icon="delete"
                  couleur="secondary"
                  @click="supprimer(parametre)"
                />
              </td>
            </tr>
            <div class="my-3">
              <div v-for="param in parametre" :key="`param-${param.id}`" class="w-auto inline-flex items-center px-6 py-2 mr-2 bg-blue-view rounded-lg">
                {{ param.profil.libelle}}
              </div>
            </div>
          </template>
        </tbody>
      </table>
    </div>
    <ButtonRight
      v-if="isAjoutPossible"
      label="Ajouter une condition de visualisation des créneaux"
      icon="add"
      couleur="danger"
      class="ml-8"
      @click="add()"
    />
  </CardModalSection>

  <form @submit.prevent="save">
    <Modal
      v-if="modaleVisible"
      :title="modal_title"
      @cancel="closeModal"
    >
      <div class="mb-6">
        <Input
          id="TeditDayView"
          type="number"
          label="Nombre de jours visibles pour la réservation de créneaux"
          v-model="formulaire.valeur"
          required
        />
      </div>
      <div>
        <div v-for="profilAssocie in formulaire.profils" :key="`profil-${profilAssocie.id}`" class="my-3 text-lg flex items-center">
          <p class="bg-blue-view rounded-lg text-white px-2 py-1 mr-2 w-4/12 text-center">{{ profilAssocie.libelle }}</p>
          <span @click="supprimerProfil(profilAssocie.id)" class="cursor-pointer"><DeleteSVG /></span>
        </div>

        <div class="mt-3 mb-6 flex items-center" v-if="modeFormulaire === 'par_profils' && isAjoutPossible">
          <select
            id="TfaSelectProfil"
            v-model="formulaire.profil"
            class="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <template v-for="(profil, i) in profilsSelectables"
                      :key="i">
              <option v-if="isProfilDisponible(profil)"
                      :value=" profil.id ? '/api/profils/' + profil.id : profil.id"
              >
                {{ profil.libelle }}
              </option>
            </template>
          </select>
        </div>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Modal from "@components/common/Modal.vue"
import DeleteSVG from "@components/svg/DeleteSVG.vue"
import CardModalSection from "@components/common/CardModalSection.vue"
import Button from "@components/common/Button.vue"
import ButtonRight from "@components/common/ButtonRight.vue"
import Input from "../common/Input.vue"

import { getProfils } from "@api/profil.js"
import { useParamStore } from "@stores/parametre.js"
import {
  deleteParametreFitArenaProfil,
  patchParametreFitArena,
  patchParametreFitArenaProfil,
  postParametreFitArenaProfil,
  putParametreFitArenaProfil,
  updateParametreFitArena
} from "@api/parametreFitArena.js"

import { computed, onMounted, reactive, ref } from "vue"
import { useRoute } from "vue-router"
import { toast } from "vue3-toastify"

const params = useParamStore()
const PARAM_NB_JOURS_VISIBLES = 'nombre_de_jours_visibles_pour_la_reservation_de_creneaux_par_les_utilisateurs_grand_public'
const PARAM_NB_JOURS_VISIBLES_PROFIL = 'nombre_de_jours_visibles_pour_la_reservation_de_creneaux_par_profil'
const idFitArena = computed(() => useRoute().params.id)
const fitArena = computed(() => '/api/fit_arenas/' + idFitArena.value)
const profils = ref([])
const modal_title = ref('')
const modaleVisible = ref(false)
const modeFormulaire = ref('par_defaut')

const formulaire = reactive({
  valeur: null,
  id: null,
  parametre: '/api/parametres/10',
  fitArena: fitArena.value,
  actif: true,
  profil: null,
  profilsASupprimer: []
})

const emits = defineEmits(['suppression'])

const parametreFitArena = computed(() => useParamStore().parametreFitArenas?.[PARAM_NB_JOURS_VISIBLES])
const parametreFitArenaProfils = computed(() => useParamStore().parametreFitArenaProfils)

onMounted(async () => {
  profils.value = await getProfils()
})

const profilsSelectables = computed(() => [{ id: null, iri: null, libelle: "- Ajouter un profil -" }, ...profils.value])

const rafraichir = async () => {
  await params.fetchParametres(idFitArena.value)
}

const modificationStatus = async (parametre, profil = false) => {
  try {
    parametre.actif = !parametre.actif
    if (profil) {
      await patchParametreFitArenaProfil({ actif: parametre.actif }, parametre.id)
    } else {
      await patchParametreFitArena({ actif: parametre.actif }, parametre.id)
    }
    toast.success('Modification du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const editParDefaut = async (parametres) => {
  initFormulaire(parametres)
  modeFormulaire.value = 'par_defaut'
  modal_title.value = 'Modifier une condition de visualisation des créneaux'
}

const modificationStatusParProfils = async (parametres) => {
  try {
    const actif = parametres[0].parametre.actif = !parametres[0].parametre.actif
    for (const param of parametres) {
      await patchParametreFitArenaProfil({ actif }, param.parametre.id)
    }
    toast.success('Modification du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const supprimer = async(parametres) => {
  const ids = parametres.map(param => param.parametre.id);
  emits('suppression', ids, deleteParametreFitArenaProfil)
}

const editAvecProfils = async (parametres) => {
 initFormulaire(parametres[0].parametre)
  formulaire.profil = null
  formulaire.profils = parametres.map(parametre => ({
    id: parametre.parametre.id,
    iri: parametre.profil.iri,
    libelle: parametre.profil.libelle
  }))
  modeFormulaire.value = 'par_profils'
  modal_title.value = 'Modifier une condition de visualisation des créneaux'
}

const initFormulaire = (parametre) => {
  formulaire.parametre = parametre.iri
  formulaire.valeur =  parametre.valeur
  formulaire.actif = parametre.actif
  formulaire.id = parametre.id
  formulaire.fitArena = fitArena.value
  modaleVisible.value = true
}

const add = () => {
  modaleVisible.value  = true
  modal_title.value = 'Ajouter une condition de visualisation des créneaux'
  formulaire.fitArena = fitArena.value
  formulaire.parametre = '/api/parametres/11'
  formulaire.id = null
  modeFormulaire.value = 'par_profils'
}

const reset = () => {
  formulaire.valeur = null
  formulaire.id = null
  formulaire.actif = true
  formulaire.profilsASupprimer = []
  formulaire.profil = null
}

const closeModal = () => {
  modaleVisible.value = false
  reset()
}

const supprimerProfil = async(id) => {
  const index = formulaire.profils.findIndex(profil => profil.id === id)
  const profil = formulaire.profils[index]
  formulaire.profilsASupprimer.push(profil)
  formulaire.profils.splice(index, 1)
}

const save = async () => {
  if (modeFormulaire.value === "par_profils") {
    await saveParProfils()
  } else if (modeFormulaire.value === "par_defaut") {
    await saveParDefaut()
  }
}

const saveParDefaut = async () => {
  const corps = {
    fitArena:  formulaire.fitArena,
    parametre: formulaire.parametre,
    actif: formulaire.actif,
    valeur: '' + formulaire.valeur
  }

  try {
    if (formulaire.id) {
      await updateParametreFitArena(corps, formulaire.id)
    } else {
      toast.error('Erreur, Veuillez contacter votre administrateur')
      // Les paramètres par défaut doivent déja être en base, pas de POST
      return
    }
    toast.success('Paramètre sauvegardé')
    await rafraichir()
    closeModal()
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const saveParProfils = async () => {
  const corps = {
    fitArena: formulaire.fitArena,
    parametre: formulaire.parametre,
    actif: formulaire.actif,
    valeur: '' + formulaire.valeur
  }

  try {
    if (formulaire.id) {
      await miseAJourParProfil(corps)
    } else {
      await ajoutParProfil(corps)
    }
    await rafraichir()
    toast.success('Paramètre sauvegardé')
    closeModal()
  } catch (e) {
    console.log(e)
    toast.error('Erreur, veuillez contacter votre administrateur')
  }
}

const miseAJourParProfil = async(corps) => {
  if (formulaire.profil) {
    corps.profil = formulaire.profil
    await postParametreFitArenaProfil(corps)
  }

  if (formulaire.profilsASupprimer.length) {
    for (const profil of formulaire.profilsASupprimer) {
      await deleteParametreFitArenaProfil(profil.id)
    }
  }

  if (formulaire.profils) {
    formulaire.id = null
    for (const profil of formulaire.profils) {
      corps.id = profil.id
      corps.profil = profil.iri
      await putParametreFitArenaProfil(corps, corps.id)
    }
  }
}

const ajoutParProfil = async(corps) => {
  if (formulaire.profil) {
    corps.profil = formulaire.profil
  }
  await postParametreFitArenaProfil(corps)
}

const profilsUtilises = computed(() => {
  let profils = []
  const param = parametreFitArenaProfils.value?.[PARAM_NB_JOURS_VISIBLES_PROFIL] ?? {}
  for (const valeur in param) {
    for (const entree of param[valeur]) {
      profils.push(entree.profil.iri)
    }
  }
  return profils
})

// Si les données ne sont pas chargées, je ne veux pas afficher le bouton d'ajout
const isAjoutPossible = computed(() => (profilsUtilises.value?.length ?? 1) === 0 || (profilsUtilises.value?.length ?? 1000) < (profils.value?.length ?? 0))

const isProfilDisponible = (leProfil) => {
  return !profilsUtilises.value.includes(leProfil.iri)
}
</script>