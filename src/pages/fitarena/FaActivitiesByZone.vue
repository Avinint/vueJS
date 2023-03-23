
<template>
  <Card>
    <h1>Activités par zone</h1>
    <div class="p-10">
      <Card class="space-y-3 mb-10" v-for="(zoneFit, zoneIdx) of zones">
        <h2>{{zoneFit.libelle}}</h2>

        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">Actif</th>
              <th scope="col" class="px-6 py-3">Libellé</th>
            </tr>
            </thead>
            <tbody>
            <tr class="bg-white" v-for="(act, i) in zoneFit.zoneActivites">
              <td class="flex justify-center items-center p-3">
                <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeActiviteZone(act.id)"/>
                <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editActiviteZone(act.id)"/>
              </td>
              <td class="px-6 py-4">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="true" class="sr-only peer" v-model="act.actif" @change="modifieActivite(act)" >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                </label>
              </td>
              <td class="px-6 py-4">{{ act.activite.libelle }}</td>

              <td class="px-6 py-4">
                <Button label="Détails" type="secondary" @click="showActivite(i)"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <Button label="Ajouter une Activite" icon="add" type="secondary" @click="addActiviteZone(zoneIdx)" id="TaddActivite"/>
      </Card>
      <form @submit.prevent="saveActiviteZone">
        <Modal v-if="activiteZone_modal" :type="readonly ? 'visualiser' : 'classic'" :title="modal_title" @cancel="activiteZone_modal = false" class="activite_zone_modal">

          <div>
            <label for="select_activites" class="mr-4">Activité</label>
            <select id="select_activites" v-model="activite_selected" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option v-for="act of activites" :value="act.id">{{ act.libelle }}</option>
            </select>
          </div>

          <div class="flex items-center">
            <div class="block mb-2 text-sm font-medium text-gray-900 w-1/2">
              Config des équipements motorisés
            </div>
            <div>
              <template v-for="mode of modes">
                <input required="required" type="radio" name="mode_equipements_motorises" :value="mode.id" :id="'mode_equipements_motorises_'+mode.id" v-model="mode_equipements_motorises">
                <label :for="'mode_equipements_motorises_'+mode.id">{{ mode.libelle }}</label>
              </template>
            </div>
          </div>

          <div class="flex items-center">
            <div class="block mb-2 text-sm font-medium text-gray-900 w-1/2">
              Mode d'écran géant et d'interface de vidéo et scoring
            </div>
            <div>
              <input type="radio" name="mode_ecran_interface" :value="0" id="mode_ecran_interface_0" v-model="mode_ecran_interface">
              <label :for="'mode_ecran_interface_0'">Aucun</label>
              <template v-for="mode of modes">
                <input type="radio" name="mode_ecran_interface" :value="mode.id" :id="'mode_ecran_interface_'+mode.id" v-model="mode_ecran_interface">
                <label :for="'mode_ecran_interface_'+mode.id">{{ mode.libelle }}</label>
              </template>
            </div>
          </div>

          <div class="flex items-center">
            <div class="mr-4">Division en sous-zones</div>
            <div class="bg-slate-300 rounded-full flex items-center justify-center w-8 h-8 mr-4">{{ sous_zones.length }}</div>
            <div class="text-blue-300	text-sm">
              Sous-zone : surface réservable par les utilisateurs (= terrain)
            </div>
          </div>

          <div v-for="sous_zone in sous_zones" class="border border-gray-300 rounded-md p-4">
            <div>{{ sous_zone.libelle }}</div>
          </div>

        </Modal>
      </form>
    </div>
  </Card>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import {onMounted, ref} from "vue";
import {
  deleteActivitesByZones,
  getActiviteByZone,
  getActivitesByZones,
  postActivitesByZones,
  updateActivitesByZones,
  patchActivitesByZones
} from "../../api/activiteByZone";
import { getZones } from "../../api/zone";
import { getModes } from '../../api/mode';
import { getParametres } from '../../api/parametre';
import { getParametreZoneActivites, postParametreZoneActivites, updateParametreZoneActivites, deleteParamatreZoneActivites } from '../../api/parametreZoneActivite';
// import { getZoneActivite } from '../../api/zoneActivite';
import {getActivites, patchActivites} from "../../api/activite";
import Select from "../../components/common/Select.vue";
import {toast} from "vue3-toastify";
const props = defineProps(['id'])
const activiteZone_modal = ref(false)
const readonly = ref(false)
const activiteZones = ref([])
const zones = ref([])
// const zone = ref({})
const activiteZone = ref({})
const activiteZone_selected = ref(0)
const activites = ref([])
const modal_title = ref('');
const zone_selected = ref(0);
const activite_selected = ref(0);
const modes = ref([]);
const mode_equipements_motorises = ref(0);
const mode_ecran_interface = ref(0);
const id_parametre_config_equipements_motorises = ref(0);
const id_parametre_mode_ecran_interface_video_scoring = ref(0);
const sous_zones = ref([]);

const addActiviteZone = (zoneIdx) => {
  activiteZone_selected.value = 0;
  activiteZone_modal.value = true;
  const zone = zones.value[zoneIdx];
  zone_selected.value = zone.id;
  activite_selected.value = activites.value[0].id;
  modal_title.value = "Ajouter une activité à la zone " + zone.libelle;
  mode_equipements_motorises.value = 0;
  mode_ecran_interface.value = 0;
};

const removeActiviteZone = async (i) => {
  await deleteActivitesByZones(i)
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena='+props.id)
  activites.value = await getActivites(props.id)
  activiteZone_modal.value = false
}

const editActiviteZone = async (i) => {
  const activiteZoneTemp = await getActiviteByZone(i)
  mapApiToData(activiteZoneTemp)
  modal_title.value = "Modifier une activité de la zone " + activiteZoneTemp.zone.libelle;
  activiteZone_modal.value = true
  readonly.value = false
  sous_zones.value = [];

  // récupération des valeurs des paramètres nécessaires
  mode_equipements_motorises.value = 0;
  mode_ecran_interface.value = 0;
  let data = await getParametreZoneActivites(1, '&zoneActivite=' + activiteZone_selected.value);
  data.forEach(datum => {
    switch (datum.parametre.id) {
      case id_parametre_config_equipements_motorises.value:
        mode_equipements_motorises.value = datum.valeur;
        break;
      case id_parametre_mode_ecran_interface_video_scoring.value:
        mode_ecran_interface.value = datum.valeur;
        break;
    }
  });

  // récupération de la liste des sous-zones
  data = await getSousZones(zone_selected.value);
  data.forEach(datum => {
    sous_zones.value.push(datum);
  });
}

const showActiviteZone = async (i) => {
  const activiteZoneTemp = await getActiviteByZone(i)
  mapApiToData(activiteZoneTemp)
  activiteZone_modal.value = true
  readonly.value = true
}

const mapApiToData = (activiteZoneTemp) => {
  activiteZone.value = activiteZoneTemp;
  activiteZone_selected.value = activiteZoneTemp.id;
  activite_selected.value = activiteZoneTemp.activite.id;
  zone_selected.value = activiteZoneTemp.zone.id;
}

const modifieActivite = async({actif,id}) => {
  try {
    await patchActivitesByZones({actif}, id)
    toast.success('Modification de l\'activité avec succès');
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur');
  }
}

const saveActiviteZone = async () => {
  const ActiviteZoneTemp = {
    activite: '/api/activites/' + activite_selected.value,
    // actif: equipement.value.actif == true ? equipement.actif.statut : false
    ordre: 0,
    actif: true,
  }

  if (zone_selected.value) {
    ActiviteZoneTemp.zone = '/api/zones/' + zone_selected.value;
  }

  if (activiteZone_selected.value) {
    // édition
    const data = await updateActivitesByZones(ActiviteZoneTemp, activiteZone_selected.value)

    // param config équipements motorisés
    let parametreZoneActivites = await getParametreZoneActivites(1, '&zoneActivite=' + activiteZone_selected.value + '&parametre=' + id_parametre_config_equipements_motorises.value);
    if (parametreZoneActivites[0]?.id) {
      await updateParametreZoneActivites(parametreZoneActivites[0].id, {
        valeur: mode_equipements_motorises.value.toString(),
      });
    }

    // param mode d'écran et d'interface vidéo scoring
    parametreZoneActivites = await getParametreZoneActivites(1, '&zoneActivite=' + activiteZone_selected.value + '&parametre=' + id_parametre_mode_ecran_interface_video_scoring.value);
    if (parametreZoneActivites[0]?.id) {
      if (mode_ecran_interface.value > 0) {
        // modif du paramètre
        await updateParametreZoneActivites(parametreZoneActivites[0].id, {
          valeur: mode_ecran_interface.value.toString(),
        });
      } else {
        // aucun mode => suppression du paramètre
        await deleteParamatreZoneActivites(parametreZoneActivites[0].id)
      }
    } else if (mode_ecran_interface.value > 0) {
      // le paramètre n'existe pas encore
      let body = {
        zoneActivite: '/api/zone_activites/' + activiteZone_selected.value,
        parametre: '/api/parametres/' + id_parametre_mode_ecran_interface_video_scoring.value,
        valeur: mode_ecran_interface.value.toString(),
      };
      await postParametreZoneActivites(body);
    }

  } else {
    // création
    const data = await postActivitesByZones(ActiviteZoneTemp)

    // param config équipements motorisés
    let body = {
      zoneActivite: '/api/zone_activites/' + data.id,
      parametre: '/api/parametres/' + id_parametre_config_equipements_motorises.value,
      valeur: mode_equipements_motorises.value.toString(),
    };
    await postParametreZoneActivites(body);

    // param mode d'écran et d'interface vidéo scoring
    if (mode_ecran_interface.value > 0) {
      body.parametre = '/api/parametres/' + id_parametre_mode_ecran_interface_video_scoring.value;
      body.valeur = mode_ecran_interface.value.toString();
      await postParametreZoneActivites(body);
    }

  }

  activiteZone_modal.value = false
  cancel()
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena='+props.id)
  activites.value = await getActivites(props.id)

};

onMounted(async () => {
  zones.value = await getZones(1, '&typeZone.code=zone&fitArena='+props.id)
  activites.value = await getActivites(props.id)
  modes.value = await getModes();
  let data = await getParametres(1, '&code=config-des-equipements-motorises');
  id_parametre_config_equipements_motorises.value = data[0]?.id;
  data = await getParametres(1, '&code=mode-d-ecran-geant-et-d-interface-de-video-et-scoring');
  id_parametre_mode_ecran_interface_video_scoring.value = data[0]?.id;
});

const getSousZones = async (parentId) => {
  return await getZones(1, '&idZoneParent=' + parentId);
};

const cancel = () => {
  zone_selected.value = 0;
  activite_selected.value = 0;
  activiteZone_selected.value = 0;
  sous_zones.value = [];
};
</script>


<style scoped>
.activite_zone_modal input[type=radio] {
  display: none;
}
.activite_zone_modal input[type=radio] + label {
  margin-right: .5em;
  cursor: pointer;
  padding: .25em 1em;
}
.activite_zone_modal input[type=radio]:checked + label {
  background-color: #ddd;
  border-radius: .5em;
}
</style>
