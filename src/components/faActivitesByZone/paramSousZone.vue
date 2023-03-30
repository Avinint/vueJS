<template>

    <div>
        <div>
            <Input v-model="nombreParticipantsMax" :label="parametreNombreParticipantsMax.libelle" type="number" id="" />
        </div>

        <div>
            <Input v-model="nombreParticipantsConseille" :label="parametreNombreParticipantsConseille.libelle" type="number" id="" />
        </div>

        <p class="text-blue-300	text-sm">Le prix par personne indiqué aux utilisateurs sera basé sur le nombre de joueurs conseillé.</p>

        <div>
            <div>
                Interface de vidéo et scoring
            </div>
            <div>
                <templace v-for="elt in equipementsTablette">
                    <input v-model="tablettesSousZone" type="checkbox" :value="elt.id" name="equipement_tablette[]" :id="'equipement_tablette_' + elt.id">
                    <label :for="'equipement_tablette_' + elt.id">{{ elt.libelle }}</label>
                </templace>
            </div>
        </div>

        <div>
            <div>
                Écrans
            </div>
            <div>
                <templace v-for="elt in equipementsEcran">
                    <input type="checkbox" :value="elt.id" name="equipement_ecran[]" :id="'equipement_ecran_' + elt.id">
                    <label :for="'equipement_ecran_' + elt.id">{{ elt.libelle }}</label>
                </templace>
            </div>
        </div>

        <div>
            <div>
                Caméras de jeu
            </div>
            <div>

            </div>
        </div>

        <div>
            <div>
                Sonorisation
            </div>
            <div>

            </div>
        </div>
    </div>

</template>

<script setup>

// récupérer id param nombre-de-participants-max
// récupérer id param nombre-de-participants-conseille
// récupérer les équipements de type tablette (de la zone parent)
// récupérer les équipements de type écran ecran-geant + ecran-accueil + ecran-attente (de la zone parent)
// récupérer les équipements de type caméra (de la zone parent)
// récupérer les équipements de type sonorisation (de la zone parent)
// récupérer les équipements de la sous-zone

// faire un component pour gérer des checkbox stylisés (cf. component des radio)

import { onMounted, ref, computed, watch } from "vue";
import { getEquipementsByZone } from '../../api/equipement';

import Input from '../../components/common/Input.vue';

const props = defineProps([
    'i',
    'zone',
    'sousZone',
    'sousZoneParametres',
    'zoneEquipementsByType'
]);

const parametreNombreParticipantsMax = ref({});
const nombreParticipantsMax = ref(0);
watch(nombreParticipantsMax, async (newValue, oldValue) => {
    setParametreValeur(parametreNombreParticipantsMax.value.id, newValue);
});
const parametreNombreParticipantsConseille = ref({});
const nombreParticipantsConseille = ref(0);
watch(nombreParticipantsConseille, async (newValue, oldValue) => {
    setParametreValeur(parametreNombreParticipantsConseille.value.id, newValue);
});
const parametres = ref([]);
const equipementsTablette = ref([]);
const tablettesSousZone = ref([]);
const equipementsEcran = ref([]);
const equipementsCamera = ref([]);
const equipementsSono = ref([]);
const equipementsSousZone = ref([]);

onMounted(async () => {
    parametreNombreParticipantsMax.value = props.sousZoneParametres.nombreParticipantsMax;
    parametreNombreParticipantsConseille.value = props.sousZoneParametres.nombreParticipantsConseille;

    equipementsTablette.value = props.zoneEquipementsByType.tablette;
    equipementsEcran.value = props.zoneEquipementsByType.ecran;
    equipementsCamera.value = props.zoneEquipementsByType.camera;
    equipementsSono.value = props.zoneEquipementsByType.sonorisation;

    equipementsSousZone.value = await getEquipementsByZone(1, props.sousZone.id);

    parametres.value = props.sousZone.zoneActivites[0].parametreZoneActivites;

    nombreParticipantsMax.value = getParamatreValeurById(parametreNombreParticipantsMax.value.id) || 0;
    nombreParticipantsConseille.value = getParamatreValeurById(parametreNombreParticipantsConseille.value.id) || 0;
});

const getParamatreValeurById = id => {
    return getParametreById(id)?.valeur;
};

const setParametreValeur = (id, valeur) => {
    const param = getParametreById(id);
    if (param) {
        param.valeur = valeur;
    } else {
        parametres.value.push({
            id: 0,
            parametre: { id },
            valeur
        });
    }

};

const getParametreById = id => {
    return parametres.value?.filter(param => param.parametre.id === id).shift();
};

</script>