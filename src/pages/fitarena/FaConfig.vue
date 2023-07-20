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
              <input v-model="ville" class="w-full border-slate-300 border-1 mb-2" type="text">
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

import { onMounted, ref, watch } from 'vue'
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

const route = useRoute()
const selectVille = ref(false)
const ordre = ref(1)
const ville = ref("")
const rechercheVille = ref("")
const optionsVille = ref([])
const urlMiniature = ref("")
const urlBandeau = ref("")
const miniature = ref(null)


const reseauxSociaux = ref([])

// const fitArena = ref({})

const parametres = ref([])
const address_selected = ref({})
const fitArenaId = ref(null)
const nouveauService = {libelle: "", icone: null}
const nouveauReseauSocial = {libelle: "", url: ""}
const services = ref([])

onMounted(async () => {
  const fit =   await getFitArenaConfig(route.params.id)

  fitArenaId.value = fit.fitArenaId
  ville.value = `${fit.ville} ${fit.departement} (${fit.numeroDepartement})`
  ordre.value = fit.ordre || 1
  urlMiniature.value = fit.urlMiniature
  urlBandeau.value = fit.urlBandeau
  services.value = [...(fit.services || [])]

})

// watch(() => selectVille, () => {
//   if (ville.value.length) {
//     optionsVille.value = getVilles(ville.value)
//   }
// })



const modifier = () => {

  fit_arena.value =
    {
      ordre: ordre.value,
      adresse: {
        adresse: address_selected.value.label,
        complement: complement.value,
        codePostal: address_selected.value.postcode,
        ville: address_selected.value.city,
        pays: 'france',

        numeroDepartement: '' + address_selected.value.context.split(',')[0],
        nomDepartement: '' + address_selected.value.context.split(',')[1],
      },
    }
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
    service.fitArenaId = fitArenaId
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
  const valide = true
  let erreur = ''
console.log(rs)
  if (!rs.libelle.length) {
    erreur = "Le champ libellé est requis"
  }
  if (!rs.url.length) {
    erreur = "Le champ url est requis"
  }

  if (!erreur) {
    rs.fitArenaId = fitArenaId.value

    if (rs.id) {
      const fit = await putReseauSocial(rs)
    } else {
      const fit = await postReseauSocial(rs)
    }

    toast.success("Réseau social ajouté avec succès")
  } else {
    toast.error(e)
  }


  service.fitArenaId = fitArenaId
  console.log(services.value)


}




const urlService = (service, e) => {
  if (e.target.value.replace(' ', '').length) {
    service.url = e.target.value
  }
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

