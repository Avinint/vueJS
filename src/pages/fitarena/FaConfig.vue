<template>
  <Card>
    <h1>Front : page d'accueil</h1>
    <div class="flex relative my-4 mx-6 overflow-x-auto text-black">
        <table class="w-2/3 border-collapse border border-gray-300">
          <colgroup>
            <col span="1" class="w-2/5 bg-gray-100">
            <col span="1" class="w-3/5">
          </colgroup>
          <tbody >
          <tr>
            <td class="border border-gray-300 p-2">Miniature</td>
            <td class="border border-gray-300 p-2">
              <label class="upload " for="uploadMiniature">
                <div class="bg-gray-50 mx-2 px-3 py-1 border border-gray-300 inline-block">Choisir un fichier <UploadSVG/></div>
              </label>
              <input @change="uploadMiniature" id="uploadMiniature" class="w-1/2 border-slate-300 border-1 mb-2" type="file" style="display:none;" >
              <span class="text-gray-400">Taille maximale : 5 mo</span>
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">Ville, département (numéro)</td>
            <td class="border border-gray-300 p-2">
              <div class="w-full border-slate-300 border-1 mb-2">{{ ville }}</div>
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">Ordre d'affichage</td>
            <td class="border border-gray-300 p-2"><input type="number" min="0" v-model="ordre" class="w-full border-slate-300 border-1 mb-2"></td>
          </tr>
          </tbody>
        </table>
    </div>
    <div class="w-full">
      <img :src="asset(urlMiniature)" class="miniature" alt="miniature" v-if="urlMiniature">
    </div>
  </Card>

  <Card>
    <h1>Front : page de réservation</h1>
    <div class="flex relative my-4 mx-6 overflow-x-auto text-gray-400">
      <table class="w-2/3 border-collapse border border-gray-300">
        <colgroup>
          <col span="1" class="w-2/5 bg-gray-100 px-10">
          <col span="1" class="w-3/5">
        </colgroup>
        <tbody >
        <tr>
          <td class="border border-gray-300 p-2">Url</td>
          <td class="border border-gray-300 p-2"><input type="text" min="0" v-model="slug" class="w-full border-slate-300 border-1 mb-2"></td>
        </tr>
        <tr>
          <td class="border border-gray-300 p-2">Bandeau</td>
          <td class="border border-gray-300 p-2">
            <label class="upload " for="uploadBandeau">
              <div class="bg-gray-50 mx-2 px-3 py-1 border border-gray-300 inline-block">Choisir un fichier <UploadSVG/></div>
            </label>
            <input @change="uploadBandeau" id="uploadBandeau" class="w-1/2 border-slate-300 border-1 mb-2" type="file" style="display:none;" >
            <span class="text-gray-400">Taille maximale : 5 mo</span>
          </td>
        </tr>
        <tr>
            <td class="flex items-center p-2">
              <label class="mb-2 block w-1/2 text-gray-900">Adresse</label>
            </td>
            <td class="border border-gray-300 p-2">
            <Input label="Adresse" v-model="address" class="border-slate-300 border-1 mb-2" type="text"  inline/>

            <div v-if="!readonly && address.length" class="flex items-center">
              <div class="mr-1.5 block w-1/2"></div>
              <select
                id="TconfSelectAdresse"
                v-model="address_selected"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                @change="addressSelect"
              >
                <option v-for="(address, i) in addresses" :key="i" :value="address">
                  {{ address.label }}
                </option>
              </select>
            </div>
            <template v-if="address_selected">
              <Input
                id="TadresseComplement"
                v-model="complement"
                :readonly="readonly"
                :type="'text'"
                label="Complément"
                class="w-full"
                inline
              />
              <Input
                id="TadressePostcode"
                v-model="address_selected.postcode"
                :readonly="readonly"
                :type="'text'"
                :required="true"
                label="Code postal"
                class="w-full"
                pattern="[0-9]{5}"
                inline
              />
              <Input
                id="TadresseCity"
                v-model="address_selected.city"
                :readonly="readonly"
                :type="'text'"
                :required="true"
                label="Ville"
                class="w-full"
                pattern="[A-Za-zÉéÈèËëÊêÀàÂâÄäÛûùÖöÔôÎîÏï \-]{1,50}"
                inline
              />
              <Input
                inline
                label="Latitude"
                v-model="address_selected.latitude"
                :readonly="readonly"
                type="text"
                class="w-full"
                pattern="-?[0-9]{1,2}\.[0-9]{1,10}"
                placeholder="46.7897"
              />
              <Input
                id="TfaLongitude"
                v-model="address_selected.longitude"
                :readonly="readonly"
                type="text"
                label="Longitude"
                inline
                class="w-full"
                pattern="-?[0-9]{1,2}\.[0-9]{1,10}"
              />
            </template>
              <MentionChampsObligatoires/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div>
      <Button
        id="TconfigFitArena"
        label="Configurer la Fit arena"
        icon="add"
        couleur="secondary"
        @click="save"
      />
    </div>

    <div class="w-full">
      <img :src="asset(urlBandeau)" class="bandeau" alt="bandeau" v-if="urlBandeau">
    </div>

    <div class="p-6  w-full">
      <LabelText text="Services"/>
    </div>
    <div class="flex relative my-4 mx-6 overflow-x-auto text-gray-400">
        <table class="w-2/3 border-collapse border border-gray-100">
          <colgroup>
            <col span="1" class="w-2/5">
            <col span="1" class="w-3/5">

          </colgroup>
          <tbody >
          <tr v-for="(service, index) in services" :key="index">

            <td class="border border-gray-300">
              <input @keydown.enter="enregistrerService(service, index)" v-model="service.libelle" class="border border-gray-50 bg-gray-100" placeholder="Libellé " type="text">
            </td>
            <td class="border border-gray-300 px-4">
              <span>Icône</span>

              <label class="upload" :for="'editService' + index">
                <span class="bg-gray-50 mx-2 px-3 py-1 border border-gray-300 inline-block">Choisir un fichier <UploadSVG/></span>
              </label>
              <input @change="uploadIconeService(services[index], $event)" :id="'editService' + index" class="w-1/2 border-slate-300 border-1 mb-2" type="file" style="display:none;" >
              <span>Taille maximale : 5 mo</span>
            </td>
          </tr>
          </tbody>
        </table>
    </div>
    <div class="w-full">
      <Button
          id="TaddService"
          label="Ajouter un Service"
          icon="add"
          couleur="secondary"
          @click="ajouterService"
      />
    </div>

    <div class="p-6  w-full">
      <LabelText text="Réseaux sociaux"/>
    </div>
    <div class="flex relative my-4 mx-6 overflow-x-auto text-gray-400">
      <table class="w-2/3 border-collapse border border-gray-100">
        <colgroup>
          <col span="1" class="w-2/5">
          <col span="1" class="w-3/5">

        </colgroup>
        <tbody >
        <tr v-for="(reseau, index) in reseauxSociaux" :key="index">

          <td class="border border-gray-300">
            <input @keydown.enter="enregistrerReseauSocial(reseau, index)" v-model="reseau.libelle" class="border border-gray-50 bg-gray-100" placeholder="Libellé " type="text">
          </td>
          <td class="border border-gray-300">
            <input @keydown.enter="enregistrerReseauSocial(reseau, index)" v-model="reseau.url" class="border border-gray-50 bg-gray-100" placeholder="URL" type="text">
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="w-full">
      <Button
          id="TaddRS"
          label="Ajouter un réseau social"
          icon="add"
          couleur="secondary"
          @click="ajouterReseauSocial"
      />
    </div>

  </Card>

  <form @submit.prevent="saveConfirmation">
    <ValidationModal
      v-if="modaleConfirmation === 'edit'"
      type="edit"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { asset } from "@/composables/assets.js"
import { useRoute } from 'vue-router'
import {
  getFitArenaConfig,
  uploadMiniature as uploadMiniatureConfig,
  uploadBandeau as uploadBandeauConfig,
  uploadIconeService as uploadIconeServiceAPI,
  postReseauSocial, putReseauSocial, getFitArena, updateFitarenas
} from "@api/fit-arena.js";

import Button from "@components/common/Button.vue";
import LabelText from "@components/common/LabelText.vue";
import UploadSVG from "@components/svg/UploadSVG.vue";
import {toast} from "vue3-toastify";
import { watchDebounced } from "@vueuse/core";
import { getAdresses } from "@api/address.js";
import ValidationModal from "@components/common/ValidationModal.vue";
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

const route = useRoute()
const modaleConfirmation = ref(false)
const ordre = ref(1)
const urlMiniature = ref("")
const urlBandeau = ref("")
const miniature = ref(null)
const slug = ref("")
const reseauxSociaux = ref([])
const address_selected = ref({})
const complement = ref('')
const actif = ref(false)
const addresses = ref([])
const address = ref('')

const parametres = ref([])
const fitArenaId = ref(null)
const nouveauService = {libelle: "", icone: null}
const nouveauReseauSocial = {libelle: "", url: ""}
const services = ref([])
const fitArenaConfig = ref({})
const fitArena = ref({})

const departement = ref([])
const fitArenaSave = ref({})

onMounted(async () => {
  fitArenaConfig.value  = await getFitArenaConfig(route.params.id)
  fitArena.value = await getFitArena(route.params.id)
  mapApiToData()
})

watch(() => route.params, async () => {
  fitArenaConfig.value = await getFitArenaConfig(route.params.id)
  fitArena.value = await getFitArena(route.params.id)
  mapApiToData()
})

const nomDepartement = computed(() => address_selected.value.context?.split(',') [1] ?? fitArena.value.adresse?.nomDepartement) ?? ''
const numeroDepartement = computed(() => address_selected.value.context?.split(',') [0] ?? fitArena.value.adresse?.numeroDepartement) ?? ''
const ville = computed(() => address_selected?.value && ((address_selected.value?.city ?? '') + ' ' + (nomDepartement?.value ?? '') + ' ' + (numeroDepartement?.value ?? '')) || '')

address_selected.value.context?.split(',')[0]

const mapApiToData = () => {
  refreshFitArena()
  refreshFitArenaConfig()
}
const refreshFitArena = () => {
  fitArenaId.value = fitArena.value.id
  ordre.value = parseInt(fitArena.value.ordre)
  departement.value = [fitArena.value.adresse.nomDepartement, fitArena.value.adresse.numeroDepartement]
  ville.value = `${fitArena.value.adresse.ville} ${fitArena.value.adresse.nomDepartement} (${fitArena.value.adresse.numeroDepartement})`
  slug.value = fitArena.value.slug

  address_selected.value = {
    address: fitArena.value.adresse.adresse,
    postcode: fitArena.value.adresse.codePostal,
    complement: fitArena.value.adresse.complement,
    pays: 'france',
    city: fitArena.value.adresse.ville,
    citycode: fitArena.value.adresse.codeInsee,
    latitude: fitArena.value.adresse.latitude,
    longitude: fitArena.value.adresse.longitude,
    numeroDepartement: fitArena.value.adresse.numeroDepartement,
    nomDepartement: fitArena.value.adresse.nomDepartement
  }

  address.value = address_selected.value.address
  complement.value = address_selected.value.complement
}

const refreshFitArenaConfig = () => {
  urlMiniature.value = fitArenaConfig.value.urlMiniature
  urlBandeau.value = fitArenaConfig.value.urlBandeau
  services.value =  fitArenaConfig.value.services?.map((service) => ({...service}) ) ?? []
  reseauxSociaux.value = fitArenaConfig.value.reseauxSociaux?.map((rs) => ({ ...rs})) ?? []

}

const uploadMiniature = async (e) => {
  const file = e.target.files[0]
  const fit = await uploadMiniatureConfig(fitArenaId.value, file)
  urlMiniature.value = fit.urlMiniature
}

const uploadBandeau = async (e) => {
  const file = e.target.files[0]
  const fit = await uploadBandeauConfig(fitArenaId.value, file)
  urlBandeau.value = fit.urlBandeau
}
const uploadIconeService = async(service, e) => {

  if (service.libelle.length) {
    service.icone = e.target.files[0]
    service.fitArenaId = fitArenaId.value
    const fit = await uploadIconeServiceAPI(service)
    toast.success("Service ajouté avec succès")
  } else
    toast.error("veuillez renseigner le libellé du service avant de téléverser l'icône")
}

const enregistrerService = async(service, e) => {
  if (objetModifie(service, fitArenaConfig.value.services)) {
    if (service.libelle.length) {
      const fit = await uploadIconeServiceAPI(service)
      toast.success("Service modifié avec succès")
    } else
      toast.error("Le champ libellé est requis")
  }
}

const ajouterService = () => {
  services.value.push({...nouveauService})
}
const ajouterReseauSocial = () => {
  reseauxSociaux.value.push({...nouveauReseauSocial})
}
const enregistrerReseauSocial = async (rs, i) => {
  let msg = "";
  let erreur = ''
  if (!rs.libelle.length) {
    erreur = "Le champ libellé est requis"
  }
  if (!rs.url.length) {
    erreur = "Le champ url est requis"
  }

  if (!erreur) {
    rs.fitArenaId = fitArenaId.value

    if (rs.id) {
      if (objetModifie(rs, fitArenaConfig.value.reseauxSociaux)) {
        await putReseauSocial(rs)
        msg = "Réseau social modifié avec succès";
        const index = fitArenaConfig.value.reseauxSociaux.findIndex(
          (el) => el.id === rs.id)
      }
        // fitArena.value.reseauxSociaux[index] = rs
      } else {
        const res = await postReseauSocial(rs)
        msg = "Réseau social ajouté avec succès";
      }

      if (msg.length) {
        fitArenaConfig.value = await getFitArenaConfig(route.params.id)
        refreshFitArenaConfig()
        toast.success(msg)
      }

    } else {
      toast.error(erreur)
    }
}

const save = () => {
  fitArenaSave.value = Object.assign({}, fitArena.value)
  fitArenaSave.value.ordre = ordre.value
  fitArenaSave.value.slug = slug.value
  fitArenaSave.value.client = '/api/clients/' + fitArenaSave.value.client.id
  fitArenaSave.value.adresse = {
    '@id': '/api/adresses/' + fitArena.value.adresse.id,
    adresse: address_selected.value.name,
    complement: complement.value,
    codePostal: address_selected.value.postcode,
    ville: address_selected.value.city,
    pays: 'france',
    codeInsee: '' + address_selected.value.citycode,
    latitude: '' + address_selected.value.latitude,
    longitude: '' + address_selected.value.longitude,
    numeroDepartement: '' + numeroDepartement.value,
    nomDepartement: '' + nomDepartement.value,
  }

  modaleConfirmation.value = 'edit'
}

const saveConfirmation = async () => {
  try {
    await updateFitarenas(fitArenaSave.value, fitArenaId.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
}

// const rsModifie = (rs) => fitArenaConfig.value.reseauxSociaux.find(
//   (el) => el.id === rs.id && el.libelle === rs.libelle && el.url === rs.url) === undefined

const objetModifie = (obj, liste) => liste.some(
  (el) => {
    return Object.keys(obj).every((prop) => obj[prop] === el[prop])
  }
) === false

const urlService = (service, e) => {
  if (e.target.value.replace(' ', '').length) {
    service.url = e.target.value
  }
}

watchDebounced(
  address,
  async () => {
    address_selected.value = {}
    addresses.value = await getAdresses(address.value)
    address_selected.value = addresses.value[0]
  },
  { debounce: 500, maxWait: 1000 }
)

const addressSelect = () => {
  address.value = address_selected.value.name
}
</script>

<style scoped>
.miniature{
  max-height: 200px;
}

table input {
  width: 100%;
  height: 100%;
}

input::placeholder {
  color: #c3c3c3;

}
</style>

