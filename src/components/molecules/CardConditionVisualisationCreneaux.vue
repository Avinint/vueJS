<template>
  <Card>
    <h1>Condition de visualisation des créneaux</h1>
    <div class="my-4 rounded-lg border">
      <div v-if="parametreFitArena" class="relative overflow-x-auto text-black">
        <div class="flex items-center font-light">
          <p class="p-2 bg-grey flex items-center w-5/12 justify-start">Nombre de jours visibles pour la réservation de
            créneaux par les utilisateurs GP</p>
          <p class="px-6">Actif</p>
          <label class="relative  inline-flex cursor-pointer">
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
          <div class="bg-grey  mx-1 px-4 flex justify-end rounded-lg">
            <p class="flex p-2">{{ parametreFitArena.valeur }} {{ parametreFitArena.valeur > 1 ? 'jours' : 'jour&nbsp;&nbsp;' }}</p>
          </div>
          <div class="w-1/12"></div>
          <Button
            test="TeditKeyMoment"
            borderless
            icon="edit"
            couleur="secondary"
            @click="editParDefaut(parametreFitArena)"
          />
        </div>
      </div>

      <template v-for="(parametre, index) in parametreFitArenaProfils?.[PARAM_NB_JOURS_VISIBLES_PROFIL] ?? {}"
                :key="index">
        <div class="relative overflow-x-auto text-black">

          <div class="flex items-center font-light">
            <p class="p-2 bg-grey flex items-center w-5/12 justify-start">{{ parametre[0].parametre.libelle }}</p>
            <p class="px-6">Actif</p>
            <label class="relative  inline-flex cursor-pointer">
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
            <div class="bg-grey  mx-1 px-4 flex justify-end rounded-lg">
              <p class="flex p-2">{{ index }} {{ index > 1 ? 'jours' : 'jour&nbsp;&nbsp;' }}</p>
            </div>
            <div class="w-1/12"></div>
            <Button
              test="TeditKeyMoment"
              borderless
              icon="edit"
              couleur="secondary"
              @click="editAvecProfils(parametre)"
            />
            <Button
              test="TdeleteKeyMoment"
              borderless
              icon="delete"
              couleur="secondary"
              class="flex justify-end"
              @click="supprimer(parametre)"
            />
          </div>
          <div class="my-3">

            <div v-for="param in parametre" class="w-auto text-lg inline-flex items-center px-2 py-1 mr-2 bg-sky-200 text-sky-600">
              {{ param.profil.libelle}}
            </div>
          </div>
        </div>
      </template>
    </div>
    <Button v-if="isAjoutPossible"
      class="font-bold font-black"
      label="Ajouter une condition de visualisation des créneaux"
      icon="add"
      couleur="secondary"
      @click="add()"
    />

  </Card>
  <form @submit.prevent="save">
    <Modal
      v-if="modaleVisible"
      :title="modal_title"
      @cancel="closeModal"
    >
      <div>
        <div class="mb-3 flex items-center w-full">
          <input class="w-1/2" type="number" min="0" v-model="formulaire.valeur" placeholder="Nombre de jours visibles pour la réservation de créneaux">
        </div>
        <div class="my-3">

          <div v-for="profilAssocie in formulaire.profils" class="w-auto text-lg inline-flex items-center px-2 py-1 mr-2 bg-sky-200 text-sky-600">
            {{ profilAssocie.libelle}} <span @click="supprimerProfil(profilAssocie.id)"><DeleteSVG/></span>
          </div>
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
                      :value=" profil.id ? '/api/profils/' + profil.id :  profil.id"
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

import Card from "@components/common/Card.vue";
import Switch from "@components/common/Switch.vue";
import Modal from "@components/common/Modal.vue";
import Button from "@components/common/Button.vue";
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from "vue";
import { getParametresById } from "@api/parametres.js";
import { getProfils } from "@api/profil.js";
import { useRoute } from "vue-router";
import { patchParametreActivite } from "@api/parametreActivite.js";
import { toast } from "vue3-toastify";
import {
  deleteParametreFitArenaProfil,
  patchParametreFitArena,
  patchParametreFitArenaProfil,
  postParametreFitArena, postParametreFitArenaProfil, putParametreFitArenaProfil,
  updateParametreFitArena
} from "@api/parametreFitArena.js";

import { useParamStore } from "@stores/parametre.js";
import DeleteSVG from "@components/svg/DeleteSVG.vue";

const params = useParamStore()
const PARAM_NB_JOURS_VISIBLES = 'nombre_de_jours_visibles_pour_la_reservation_de_creneaux_par_les_utilisateurs_grand_public'
const PARAM_NB_JOURS_VISIBLES_PROFIL = 'nombre_de_jours_visibles_pour_la_reservation_de_creneaux_par_profil'
const idFitArena = computed(() =>  useRoute().params.id)
const fitArena = computed(() =>  '/api/fit_arenas/' + idFitArena.value)
const profilsExistant = ref([])
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

const parametreFitArena = computed(() => params.parametres.parametreFitArenas?.[PARAM_NB_JOURS_VISIBLES])
const parametreFitArenaProfils = computed(() => params.parametres.parametreFitArenaProfils)
// const parametres = computed(() => pr ops.params)

watchEffect(() => parametreFitArena.value, () => { console.log(parametreFitArena.value) })

onMounted(async () => {
  // parametres.value = await getParametresById(13)
  profils.value = await getProfils()

  setTimeout(() => console.log(parametreFitArenaProfils.value), 500)
})

const profilsSelectables = computed(() =>   [{id: null, iri: null,  libelle: "- Ajouter un profil -"}, ...profils.value])

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
  try {

    for (const param of parametres) {
      await deleteParametreFitArenaProfil(param.parametre.id)
    }

    toast.success('Paramètre supprimé')
    await rafraichir()
    closeModal()
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
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

const initFormulaire = async(parametre) => {
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

async function supprimerProfil(id)
{
  const index = formulaire.profils.findIndex(profil => profil.id === id)
  const profil = formulaire.profils[index]
  formulaire.profilsASupprimer.push(profil)

  formulaire.profils.splice(index, 1)




}

const save = async () => {
  if (modeFormulaire.value === "par_profils") {
    saveParProfils()
  } else if (modeFormulaire.value ==="par_defaut") {
    saveParDefaut()
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
    rafraichir()
    closeModal()
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}


const saveParProfils = async () => {
  const corps = {
    fitArena:  formulaire.fitArena,
    parametre: formulaire.parametre,
    actif:     formulaire.actif,
    valeur: '' + formulaire.valeur
  }

  try {
    console.log("1 tour")
    if (formulaire.id) {
      await miseAJourParProfil(corps);
    } else {
      await AjoutParProfil(corps);
    }

    await rafraichir()
    toast.success('Paramètre sauvegardé')
    closeModal()

  } catch (e) {
    console.log(e)
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }

}

async function miseAJourParProfil(corps) {
console.log(formulaire)
  if (formulaire.profil) {
    corps.profil = formulaire.profil
    await postParametreFitArenaProfil(corps)
  }
  console.log("apres post")

  if (formulaire.profilsASupprimer.length) {
    for (const profil of formulaire.profilsASupprimer) {
      await deleteParametreFitArenaProfil(profil.id)
      console.log("supp")
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

async function AjoutParProfil(corps) {
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

// Si les données ne sont pas chargeées je ne veux pas afficher le bouton d'ajout
const isAjoutPossible = computed(() => (profilsUtilises.value?.length ?? 1) === 0 || (profilsUtilises.value?.length ?? 1000) < (profils.value?.length ?? 0))

const isProfilDisponible = (leProfil) => {
  return !profilsUtilises.value.includes(leProfil.iri)
}



</script>

<style scoped lang="scss">

</style>