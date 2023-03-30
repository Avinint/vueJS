<template>

    <div>
        <div>
            <Input v-model="nombreParticipantsMax" :label="parametreNombreParticipantsMax.libelle" type="number" :id="'sous_zone_' + sousZone.id + '_param_' + parametreNombreParticipantsMax.id" />
        </div>

        <div>
            <Input v-model="nombreParticipantsConseille" :label="parametreNombreParticipantsConseille.libelle" type="number" :id="'sous_zone_' + sousZone.id + '_param_' + parametreNombreParticipantsConseille.id" />
        </div>

        <p class="text-blue-300	text-sm">Le prix par personne indiqué aux utilisateurs sera basé sur le nombre de joueurs conseillé.</p>

        <div>
            <div>
                Interface de vidéo et scoring
            </div>
            <div>
                <templace v-for="elt in equipementsTablette">
                    <input v-model="equipementsSousZone" type="checkbox" :value="elt.id" name="equipement_tablette[]" :id="'sous_zone_' + sousZone.id + '_equipement_tablette_' + elt.id">
                    <label :for="'sous_zone_' + sousZone.id + '_equipement_tablette_' + elt.id">{{ elt.libelle }}</label>
                </templace>
            </div>
        </div>

        <div>
            <div>
                Écrans
            </div>
            <div>
                <templace v-for="elt in equipementsEcran">
                    <input v-model="equipementsSousZone" type="checkbox" :value="elt.id" name="equipement_ecran[]" :id="'sous_zone_' + sousZone.id + '_equipement_ecran_' + elt.id">
                    <label :for="'sous_zone_' + sousZone.id + '_equipement_ecran_' + elt.id">{{ elt.libelle }}</label>
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
    'zoneEquipementsByType',
    'sousZoneEquipements'
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
const equipementsEcran = ref([]);
const equipementsCamera = ref([]);
const equipementsSono = ref([]);

const equipementsSousZone = ref([]);
watch(equipementsSousZone, async (newValue, oldValue) => {
    // on émet un événement qu'on intercepte dans le composant parent
    emits('changeEquipement', props.i, newValue);
    // on modifier modifer par référence (ce qui permet de ne rien avoir à faire dans le composant parent)
    // props.sousZoneEquipements[props.sousZone.id] = newValue;
});
const emits = defineEmits(['changeEquipement']);



onMounted(async () => {
    parametreNombreParticipantsMax.value = props.sousZoneParametres.nombreParticipantsMax;
    parametreNombreParticipantsConseille.value = props.sousZoneParametres.nombreParticipantsConseille;

    equipementsTablette.value = props.zoneEquipementsByType.tablette;
    equipementsEcran.value = props.zoneEquipementsByType.ecran;
    equipementsCamera.value = props.zoneEquipementsByType.camera;
    equipementsSono.value = props.zoneEquipementsByType.sonorisation;

    parametres.value = props.sousZone.zoneActivites[0].parametreZoneActivites;

    nombreParticipantsMax.value = getParamatreValeurById(parametreNombreParticipantsMax.value.id) || 0;
    nombreParticipantsConseille.value = getParamatreValeurById(parametreNombreParticipantsConseille.value.id) || 0;

    props.sousZone.zoneActivites[0].zoneActiviteEquipements.forEach(elt => {
        equipementsSousZone.value.push(elt.equipement.id);
    });
});

const getParamatreValeurById = id => {
    return getParametreById(id)?.valeur;
};

const setParametreValeur = (id, valeur) => {
    const param = getParametreById(id);
    if (param) {
        param.valeur = valeur;
    } else {
        // le param n'existe pas encore,
        // on l'ajoute avec id = 0 (qui servira à savoir si on update ou post)
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