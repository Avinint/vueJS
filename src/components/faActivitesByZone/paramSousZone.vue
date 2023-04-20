<template>
  <div>
    <div>
        <div>
            <Input v-model="nombreParticipantsMax" :label="parametres.nombreParticipantsMax.libelle" type="number" :id="'sous_zone_' + sousZoneId + '_param_' + parametres.nombreParticipantsMax.id" :disabled="readonly" />
        </div>
        <div>
            <Input v-model="nombreParticipantsConseille" :label="parametres.nombreParticipantsConseille.libelle" type="number" :id="'sous_zone_' + sousZoneId + '_param_' + parametres.nombreParticipantsConseille.id" :disabled="readonly" />
        </div>
        <p class="text-blue-300	text-sm mb-4">Le prix par personne indiqué aux utilisateurs sera basé sur le nombre de joueurs conseillé.</p>

    </div>

    <div>
        <p class="mb-4 mt-4">
            Interface de vidéo et scoring
        </p>
        <div>
            <InputCheckbox
                v-model="equipementsSelection"
                :elements="equipementsTablette"
                name="equipement_tablette[]"
                :id="'sous_zone_' + sousZoneId + '_equipement_tablette_'"
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
                :id="'sous_zone_' + sousZoneId + '_equipement_ecran_'"
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
                :id="'sous_zone_' + sousZoneId + '_equipement_camera_'"
                :disabled="readonly"
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
                :id="'sous_zone_' + sousZoneId + '_equipement_sono_'"
                :disabled="readonly"
            />
        </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import Input from '../../components/common/Input.vue';
import InputCheckbox from '../../components/common/InputCheckbox.vue';

const props = defineProps([
    'i',
    'sousZoneId',
    'parametres',
    'parametreValeurs',
    'zoneEquipementsByType',
    'sousZoneEquipements',
    'readonly',
]);

const emit = defineEmits(['changeParamValue', 'changeEquipements'])

const nombreParticipantsMax = ref(0);
const nombreParticipantsConseille = ref(0)
const equipementsTablette = ref([]);
const equipementsEcran = ref([]);
const equipementsCamera = ref([]);
const equipementsSono = ref([]);
const equipementsSelection = ref(props.sousZoneEquipements);

onMounted(async () => {
  const paramValeurNbParticipantsMax = props.parametreValeurs.filter((elt) => {
    return elt.parametreId == props.parametres.nombreParticipantsMax.id
  }).shift();
  nombreParticipantsMax.value = paramValeurNbParticipantsMax?.valeur || 0;

  const paramValeurNbParticipantsConseille = props.parametreValeurs.filter((elt) => {
    return elt.parametreId == props.parametres.nombreParticipantsConseille.id
  }).shift();
  nombreParticipantsConseille.value = paramValeurNbParticipantsConseille?.valeur || 0;

  equipementsTablette.value = props.zoneEquipementsByType?.tablette
  equipementsEcran.value = props.zoneEquipementsByType?.ecran
  equipementsCamera.value = props.zoneEquipementsByType?.camera
  equipementsSono.value = props.zoneEquipementsByType?.sonorisation
});

watch(nombreParticipantsMax, async (newValue) => {
    emit('changeParamValue', {
        parametreId: props.parametres.nombreParticipantsMax.id,
        valeur: newValue,
        idx: props.i
    })
})

watch(nombreParticipantsConseille, async (newValue) => {
    emit('changeParamValue', {
        parametreId: props.parametres.nombreParticipantsConseille.id,
        valeur: newValue,
        idx: props.i
    })
})

watch(equipementsSelection, async (newValue) => {
    emit('changeEquipements', {
        equipementIds: newValue,
        idx: props.i
    })
})
</script>
