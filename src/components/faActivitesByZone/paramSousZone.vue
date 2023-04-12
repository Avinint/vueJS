<template>
  <div>
    <div>
        <div>
            <Input v-model="nombreParticipantsMax" :label="parametreNombreParticipantsMax.libelle" type="number" :id="'sous_zone_' + sousZone.id + '_param_' + parametreNombreParticipantsMax.id" />
        </div>
        <div>
            <Input v-model="nombreParticipantsConseille" :label="parametreNombreParticipantsConseille.libelle" type="number" :id="'sous_zone_' + sousZone.id + '_param_' + parametreNombreParticipantsConseille.id" />
        </div>
        <p class="text-blue-300	text-sm mb-4">Le prix par personne indiqué aux utilisateurs sera basé sur le nombre de joueurs conseillé.</p>
        <div>
            <p class="mb-4 mt-4">
                Interface de vidéo et scoring
            </p>
            <div>
                <InputCheckbox
                    v-model="equipementsSelection"
                    :elements="equipementsTablette"
                    name="equipement_tablette[]"
                    :id="'sous_zone_' + sousZone.id + '_equipement_tablette_'"
                    :disabled="readonly"
                />
            </div>
        </div>

        <div>
            <p class="mb-4 mt-4">
                Écrans
            </p>
            <div>
                <InputCheckbox
                    v-model="equipementsSelection"
                    :elements="equipementsEcran"
                    name="equipement_ecran[]"
                    :id="'sous_zone_' + sousZone.id + '_equipement_ecran_'"
                    :disabled="readonly"
                />
            </div>
        </div>

        <div>
            <p class="mb-4 mt-4">
                Caméras de jeu
            </p>
            <div>
                <InputCheckbox
                    v-model="equipementsSelection"
                    :elements="equipementsCamera"
                    name="equipement_camera[]"
                    :id="'sous_zone_' + sousZone.id + '_equipement_camera_'"
                />
            </div>
        </div>

        <div>
            <p class="mb-4">
                Sonorisation
            </p>
            <div>
                <InputCheckbox
                    v-model="equipementsSelection"
                    :elements="equipementsSono"
                    name="equipement_sono[]"
                    :id="'sous_zone_' + sousZone.id + '_equipement_sono_'"
                />
            </div>
        </div>
    </div>

    <div>
      <p class="mb-4 mt-4">Écrans</p>
      <div>
        <InputCheckbox
          :id="'sous_zone_' + sousZone.id + '_equipement_ecran_'"
          v-model="equipementsSousZone"
          :elements="equipementsEcran"
          name="equipement_ecran[]"
          :disabled="readonly"
        />
      </div>
    </div>

    <div>
      <p class="mb-4 mt-4">Caméras de jeu</p>
      <div>
        <InputCheckbox
          :id="'sous_zone_' + sousZone.id + '_equipement_camera_'"
          v-model="equipementsSousZone"
          :elements="equipementsCamera"
          name="equipement_camera[]"
        />
      </div>
    </div>

    <div>
      <p class="mb-4">Sonorisation</p>
      <div>
        <InputCheckbox
          :id="'sous_zone_' + sousZone.id + '_equipement_sono_'"
          v-model="equipementsSousZone"
          :elements="equipementsSono"
          name="equipement_sono[]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'

import { onMounted, ref, watch } from "vue";

import Input from '../../components/common/Input.vue';
import InputCheckbox from '../../components/common/InputCheckbox.vue';

const props = defineProps([
    'i',
    'zone',
    'activite',
    'sousZone',
    'sousZoneParametres',
    'zoneEquipementsByType',
    'sousZoneEquipements',
    'readonly',
    'creation'
]);

const parametres = ref([]);
const equipements = ref([]);
const parametreNombreParticipantsMax = ref({});
const nombreParticipantsMax = ref(0);
watch(nombreParticipantsMax, async (newValue, oldValue) => {
  setParametreValeur(parametreNombreParticipantsMax.value.id, newValue)
})
const parametreNombreParticipantsConseille = ref({})
const nombreParticipantsConseille = ref(0)
watch(nombreParticipantsConseille, async (newValue, oldValue) => {
    setParametreValeur(parametreNombreParticipantsConseille.value.id, newValue);
});
const equipementsTablette = ref([]);
const equipementsEcran = ref([]);
const equipementsCamera = ref([]);
const equipementsSono = ref([]);
const equipementsSelection = ref([]);
watch(equipementsSelection, async (newValue, oldValue) => {
    equipements.value.length = 0; // effacer tous les éléments sans casser la référence
    newValue.forEach(value => {
        equipements.value.push({
            equipement: {
                id: value
            }
        });
    });
});

// on vérifie l'activité sélectionnée dans la modal
watch(() => props.activite, async (newValue, oldValue) => {
    setup();
});

onMounted(async () => {
  parametreNombreParticipantsMax.value =
    props.sousZoneParametres.nombreParticipantsMax
  parametreNombreParticipantsConseille.value =
    props.sousZoneParametres.nombreParticipantsConseille

  equipementsTablette.value = props.zoneEquipementsByType?.tablette
  equipementsEcran.value = props.zoneEquipementsByType?.ecran
  equipementsCamera.value = props.zoneEquipementsByType?.camera
  equipementsSono.value = props.zoneEquipementsByType?.sonorisation

    setup();
});

const setup = () => {
    function getZoneActivite() {
        return props.sousZone.zoneActivites?.filter(e => e.activite.id == props.activite).shift();
    }

    let zoneActivite = getZoneActivite(); // référence !

    // si l'activité n'est pas trouvée, on l'ajoute à la liste pour pouvoir gérer la config
    if (!zoneActivite) {
        if (!props.sousZone.zoneActivites) {
            props.sousZone.zoneActivites = [];
        }
        props.sousZone.zoneActivites.push({
            activite: {
                id: props.activite
            },
            parametreZoneActivites: [],
            zoneActiviteEquipements: []
        });

        zoneActivite = getZoneActivite();
    }

    // quand on veut ajouter une nouvelle activité à une zone, on a une activité pré-sélectionnée,
    // sauf qu'on ne veut pas aller chercher les paramètres de cette activité si elle est déjà configurée
    if (props.creation) {
        zoneActivite.parametreZoneActivites.length = 0;
        zoneActivite.zoneActiviteEquipements.length = 0;
    }

    parametres.value = zoneActivite.parametreZoneActivites; // référence !
    equipements.value = zoneActivite.zoneActiviteEquipements; // référence !

  nombreParticipantsMax.value =
    getParamatreValeurById(parametreNombreParticipantsMax.value.id) || 0
  nombreParticipantsConseille.value =
    getParamatreValeurById(parametreNombreParticipantsConseille.value.id) || 0

    zoneActivite.zoneActiviteEquipements.forEach(elt => {
        equipementsSelection.value.push(elt.equipement.id);
    });
};

const getParamatreValeurById = (id) => {
  return getParametreById(id)?.valeur
}

const setParametreValeur = (id, valeur) => {
    const param = getParametreById(id);
    if (param) {
        param.valeur = valeur;
    } else {
        // le param n'existe pas encore
        parametres.value.push({
            parametre: { id },
            valeur
        });
    }

const getParametreById = (id) => {
  return parametres.value?.filter((param) => param.parametre.id === id).shift()
}
</script>
