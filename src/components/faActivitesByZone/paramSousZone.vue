<template>
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
                    v-model="equipementsSousZone"
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
                    v-model="equipementsSousZone"
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
                    v-model="equipementsSousZone"
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
                    v-model="equipementsSousZone"
                    :elements="equipementsSono"
                    name="equipement_sono[]"
                    :id="'sous_zone_' + sousZone.id + '_equipement_sono_'"
                />
            </div>
        </div>
    </div>

</template>

<script setup>

import { onMounted, ref, computed, watch } from "vue";

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
    // on modifier par référence (ce qui permet de ne rien avoir à faire dans le composant parent)
    // props.sousZoneEquipements[props.sousZone.id] = newValue;
});
const emits = defineEmits(['changeEquipement']);



onMounted(async () => {
    parametreNombreParticipantsMax.value = props.sousZoneParametres.nombreParticipantsMax;
    parametreNombreParticipantsConseille.value = props.sousZoneParametres.nombreParticipantsConseille;

    equipementsTablette.value = props.zoneEquipementsByType?.tablette;
    equipementsEcran.value = props.zoneEquipementsByType?.ecran;
    equipementsCamera.value = props.zoneEquipementsByType?.camera;
    equipementsSono.value = props.zoneEquipementsByType?.sonorisation;

    let zoneActivite;

    if (props.creation) {
        zoneActivite = props.sousZone.zoneActivites.filter(e => e.activite.id == props.activite).shift();
    }
    parametres.value = zoneActivite?.parametreZoneActivites || [];

    nombreParticipantsMax.value = getParamatreValeurById(parametreNombreParticipantsMax.value.id) || 0;
    nombreParticipantsConseille.value = getParamatreValeurById(parametreNombreParticipantsConseille.value.id) || 0;

    zoneActivite?.zoneActiviteEquipements.forEach(elt => {
        equipementsSousZone.value.push(elt.equipement.id);
    });
    emits('changeEquipement', props.i, equipementsSousZone.value);
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
        // todo: il faudrait plutôt un post dans tous les cas, et on gère insertion ou maj côté backend
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