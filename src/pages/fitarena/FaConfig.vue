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

            <td class="border border-gray-300">Miniature</td>
            <td class="border border-gray-300">
<!--              <form @submit.prevent="uploadMiniature" class="w-full">-->
              <label class="upload " for="uploadMiniature">
                <div class="bg-gray-50 mx-2 px-3 py-1 border border-gray-300 inline-block">Choisir un fichier <UploadSVG/></div>
              </label>
              <input @change="uploadMiniature" id="uploadMiniature" class="w-1/2 border-slate-300 border-1 mb-2" type="file" style="display:none;" >
              <span class="text-gray-400">Taille maximale : 5 mo</span>
<!--              </form>-->

            </td>

          </tr>
          <tr>
            <td class="border border-gray-300">Ville, département (numéro)</td>
            <td class="border border-gray-300">
              <div class="w-full border-slate-300 border-1 mb-2">{{ ville }}</div>
<!--              <select class="w-full select-ville" v-if="selectVille || ville" v-model="ville">-->
<!--                <option v-for="option in optionsVille" :key="option" value=""> {{ option }}</option>-->
<!--              </select>-->
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300">Ordre d'affichage</td>
            <td class="border border-gray-300"><input type="number" min="0" :value="ordre" class="w-full border-slate-300 border-1 mb-2"></td>
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
          <col span="1" class="w-2/5 bg-gray-100">
          <col span="1" class="w-3/5">

        </colgroup>
        <tbody >
        <tr>
          <td class="border border-gray-300">Bandeau</td>
          <td class="border border-gray-300">
            <label class="upload " for="uploadMiniature">
              <div class="bg-gray-50 mx-2 px-3 py-1 border border-gray-300 inline-block">Choisir un fichier <UploadSVG/></div>
            </label>
            <input @change="uploadBandeau" id="uploadMiniature" class="w-1/2 border-slate-300 border-1 mb-2" type="file" style="display:none;" >
            <span class="text-gray-400">Taille maximale : 5 mo</span>

          </td>

        </tr>
        <tr>
          <td class="border border-gray-300">adresse</td>
          <td class="border border-gray-300">
            <input v-model="adress_selected" class="w-full border-slate-300 border-1 mb-2" type="text">
            <!--              <select class="w-full select-ville" v-if="selectVille || ville" v-model="ville">-->
            <!--                <option v-for="option in optionsVille" :key="option" value=""> {{ option }}</option>-->
            <!--              </select>-->

            <div v-if="!readonly && address.length" class="flex items-center">
              <div class="mr-1.5 block w-1/2"></div>
              <select
                id="TorgaSelectAdresse"
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
                pattern="[A-Za-zÉéÈèËëÊêÀàÂâÄäÛûùÖöÔôÎîÏï -]{1,50}"
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
          </td>
        </tr>

        </tbody>
      </table>


    </div>
    <div class="w-full">
      <img :src="asset(urlBandeau)" class="miniature" alt="miniature" v-if="urlBandeau">
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
              <input v-model="service.libelle" class="border border-gray-50 bg-gray-100" placeholder="Libellé " type="text">
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
            <input v-model="reseau.libelle" class="border border-gray-50 bg-gray-100" placeholder="Libellé " type="text">
          </td>
          <td class="border border-gray-300">
            <input @keydown.enter="enregistrerReseauSocial(reseau)" v-model="reseau.url" class="border border-gray-50 bg-gray-100" placeholder="URL" type="text">
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

</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { asset } from "@/composables/assets.js"
import { getParametres, postParametres } from '@api/parametres.js'
import { isValid } from "@/validation.js";
import { useRoute } from 'vue-router'
import {
  getFitArenaConfig,
  uploadMiniature as uploadMiniatureConfig,
  uploadBandeau as uploadBandeauConfig,
  uploadIconeService as uploadIconeServiceAPI,
  postReseauSocial, putReseauSocial
} from "@api/fit-arena.js";
import Button from "@components/common/Button.vue";
import LabelText from "@components/common/LabelText.vue";
import BorderContainer from "@components/common/BorderContainer.vue";
import UploadSVG from "@components/svg/UploadSVG.vue";
import {toast} from "vue3-toastify";
import { getOrganismesParClient } from "@api/organisme.js";
import { watchDebounced } from "@vueuse/core";
import { getAdresses } from "@api/address.js";

const route = useRoute()
const selectVille = ref(false)
const ordre = ref(1)
const rechercheVille = ref("")
const optionsVille = ref([])
const urlMiniature = ref("")
const urlBandeau = ref("")
const miniature = ref(null)


const reseauxSociaux = ref([])

// const fitArena = ref({})

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
  figArenaConfig.value  = await getFitArenaConfig(route.params.id)
  fitArena.value = await getFitArenas()


  mapApiToData()
  // reseauxSociaux.value = [...fit.reseauxSociaux.map((rs) => JSON.parse(JSON.stringify(rs)))]

  reseauxSociaux.value = []
  for (const rs of fit.reseauxSociaux) {
    reseauxSociaux.value.push(JSON.parse(JSON.stringify(rs)))
  }
})

watch(() => route.params, async () => {
  fitArenaConfig.value = await getFitArenaConfig(route.params.id)
})

const ville = computed(( ) => address_selected.value.city + ' ' + departement.value[0] + ' '+ departement.value[1])



const mapApiToData = () => {

  fitArenaId.value = fitArenaConfig.fitArenaId
  ordre.value = fitArenaConfig.ordre ?? 1
  departement.value = [fitArenaConfig.departement, fitArenaConfig.numeroDepartement]
  ville.value = `${fitArenaConfig.ville} ${fitArenaConfig.departement} (${fitArenaConfig.numeroDepartement})`
  urlMiniature.value = fitArenaConfig.urlMiniature
  urlBandeau.value = fitArenaConfig.urlBandeau

  address_selected.value = {
    address: fitArenaConfig.adresse.adresse,
    postcode: fitArenaConfig.adresse.codePostal,
    complement: fitArenaConfig.adresse.complement,
    pays: 'france',
    city: fitArenaConfig.adresse.ville,
    citycode: fitArenaConfig.adresse.codeInsee,
    latitude: fitArenaConfig.adresse.latitude,
    longitude: fitArenaConfig.adresse.longitude,
  }

  address.value = address_selected.value.address
  complement.value = address_selected.value.complement

  services.value =  fitArenaConfig.services.map((service) => ({...service}) )

  reseauxSociaux.value = []
  for (const rs of fitArenaConfig.reseauxSociaux) {
    reseauxSociaux.value.push(JSON.parse(JSON.stringify(rs)))
  }
}

  const uploadMiniature = async (e) => {
    const file = e.target.files[0]
    const fit = await uploadMiniatureConfig(fitArenaId.value, file)
    urlMiniature.value = fit.urlMiniature
  }

const uploadBandeau = async (e) => {
  const file = e.target.files[0]
  await uploadBandeauConfig(fitArenaId.value, file)
  urlBandeau.value = fit.urlBandeau
}
const uploadIconeService = async(service, e) => {

  if (service.libelle.length) {
    service.icone = e.target.files[0]
    service.fitArenaId = fitArenaId.value
    console.log(services.value)
    const fit = await uploadIconeServiceAPI(service)
    toast.success("Service ajouté avec succès")
  } else
    toast.error("veuillez renseigner le libellé du service avant de téléverser l'icône")
}

const ajouterService = () => {
  services.value.push({...nouveauService})
}
const ajouterReseauSocial = () => {
  reseauxSociaux.value.push({...nouveauReseauSocial})
}
const enregistrerReseauSocial = async (rs) => {
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
      console.log(fitArenaConfig.value.reseauxSociaux)
      console.log(rs)


      if (rsModifie) {
        await putReseauSocial(rs)

        msg = "Réseau social modifié avec succès";
        const index = fitArenaConfig.value.reseauxSociaux.findIndex(
          (el) => el.id === rs.id)

        // fitArena.value.reseauxSociaux[index] = rs
      } else {
        await postReseauSocial(rs)
        msg = "Réseau social ajouté avec succès";
      }

      if (msg.length) {
        toast.success(msg)
      }

    } else {
      toast.error(erreur)
    }
  }
}

const save = () => {
  fitArenaSave.value = Object.assign({}, fitArenaConfig)
  fitArenaSave.value.adresse = {
    adresse: address_selected.value.label,
      complement: complement.value,
      codePostal: address_selected.value.postcode,
      ville: address_selected.value.city,
      pays: 'france',
      codeInsee: '' + address_selected.value.citycode,
      latitude: '' + address_selected.value.latitude,
      longitude: '' + address_selected.value.longitude,
      numeroDepartement: '' + departement.value[1],
      nomDepartement: '' + departement.value[0],
  }
}

const rsModifie = (rs) => fitArenaConfig.value.reseauxSociaux.find(
  (el) => el.id === rs.id && el.url === rs.url) === undefined

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

