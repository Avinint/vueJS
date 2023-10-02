<template>
  <table id="param-sous-zone" class="w-full text-left text-sm mb-4 text-gray-500 border border-gray-200">
    <thead
      class="hidden"
    >
      <tr>
        <th scope="col"></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nombre de participants max.</td>
        <td>
          <Input v-model="nombreParticipantsMax" type="number" :id="'sous_zone_' + sousZoneId + '_param_' + parametres.nombreParticipantsMax.id" :disabled="readonly" class="w-4/12" />
        </td>
      </tr>
      <tr>
        <td>Nombre de participants conseillés</td>
        <td class="flex items-center gap-8">
          <Input v-model="nombreParticipantsConseille" type="number" :id="'sous_zone_' + sousZoneId + '_param_' + parametres.nombreParticipantsConseille.id" :disabled="readonly" class="w-4/12" />
          <p class="text-blue-600	text-sm w-4/12">Le prix par personne indiqué aux utilisateurs sera basé sur le nombre de joueurs conseillé.</p>
        </td>
      </tr>
      <tr>
        <td>Interface de vidéo et scoring</td>
        <td>
          <InputCheckbox
            v-model="equipementsSelection"
            :elements="equipementsTablette"
            name="equipement_tablette[]"
            :id="'sous_zone_' + sousZoneId + '_equipement_tablette_'"
            :disabled="readonly"
          />
        </td>
      </tr>
      <tr>
        <td>Écrans</td>
        <td>
          <InputCheckbox
            v-model="equipementsSelection"
            :elements="equipementsEcran"
            name="equipement_ecran[]"
            :id="'sous_zone_' + sousZoneId + '_equipement_ecran_'"
            :disabled="readonly"
          />
        </td>
      </tr>
      <tr>
        <td>Caméras de jeu</td>
        <td>
          <InputCheckbox
            v-model="equipementsSelection"
            :elements="equipementsCamera"
            name="equipement_camera[]"
            :id="'sous_zone_' + sousZoneId + '_equipement_camera_'"
            :disabled="readonly"
          />
        </td>
      </tr>
      <tr>
        <td>Sonorisation</td>
        <td>
          <InputCheckbox
            v-model="equipementsSelection"
            :elements="equipementsSono"
            name="equipement_sono[]"
            :id="'sous_zone_' + sousZoneId + '_equipement_sono_'"
            :disabled="readonly"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

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

<style scoped>
table#param-sous-zone tr {
  font-weight: 700;
  border: 1px solid lightgray;
}
table#param-sous-zone tr > td:first-of-type {
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
  border-right: 1px solid lightgray;
  color: #000;
}

table#param-sous-zone tr > td {
  padding: 0.5rem;
}

table#param-sous-zone {
  border-radius: 30px;
}
</style>
