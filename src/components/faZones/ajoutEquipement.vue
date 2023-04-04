<template>
    <div class="cmp_zones_ajout_equipement p-4 border border-gray-300 rounded-md">
        <h2 class="text-lg pt-2 pb-5">Ajout d'équipements {{ typeEquipementTextes }}</h2>

        <div v-for="(type, typeIdx) in typeEquipements" :key="typeIdx" class="pt-2 pb-5">
            <h2 class="pt-2 pb-5">{{ type.libelle }}</h2>
            <div>
                <template v-for="(equipement, equipementIdx) in type.equipements" :key="equipementIdx">
                    <div v-if="isZoneEquipementExist(equipement)" class="flex items-center justify-between">
                        {{ equipement.libelle }}
                        <div>
                            <Button label="Détails" type="secondary" @click="detailsEquipement(typeIdx, equipementIdx)" class="mr-4"/>
                            <Button borderless icon="delete" type="secondary" @click.prevent="removeEquipementFromZone(typeIdx, equipementIdx)"/>
                        </div>
                    </div>
                </template>

                <select v-model="equipementSelectionne[typeIdx]" @change="addEquipementToZone(typeIdx)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" selected="selected">Ajouter</option>
                    <template v-for="(equipement, equipementIdx) in type.equipements" :key="equipementIdx">
                        <option v-if="!isZoneEquipementExist(equipement)" :value="equipementIdx">{{ equipement.libelle }}</option>
                    </template>
                </select>
            </div>
        </div>
    </div>

    <Modal v-if="detailsEquipement_modal" :type="'visualiser'" :title="'Détails équipement'" @cancel="detailsEquipement_modal = false">
        <div class="flex justify-between">
            <span>Adresse IP</span>
            <span>{{ detailsEquipementData.ip }}</span>
        </div>
    </Modal>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getTypeEquipements } from '../../api/typeEquipement';
import Button from '../../components/common/Button.vue';
import Modal from '../../components/common/Modal.vue'

const props = defineProps({
    typeEquipement: String,
    fa: Number,
    zone: Number,
});

const typeEquipements = ref([]);
const typeEquipementTextes = ref('');
const equipementSelectionne = ref([]);
const detailsEquipement_modal = ref(false);
const detailsEquipementData = ref({});

onMounted(async () => {

    typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code='+props.typeEquipement+'&equipements.fitArena=' + props.fa);

    if (props.typeEquipement === 'numerique') {
        typeEquipementTextes.value = 'numériques';
    } else if (props.typeEquipement === 'motorise') {
        typeEquipementTextes.value = 'motorisés';
    }

    // fixer valeurs par défaut pour les <select>
    equipementSelectionne.value = Array(typeEquipements.value.length).fill('');

});

onUnmounted(async () => {

});

const addEquipementToZone = (typeIdx) => {
    const equipement = typeEquipements.value[typeIdx].equipements;
    const equipementIdx = equipementSelectionne.value[typeIdx];
    if (equipement[equipementIdx]) {
        equipement[equipementIdx].linked = true;
    }

    equipementSelectionne.value[typeIdx] = "";
};

const removeEquipementFromZone = (typeIdx, equipementIdx) => {
    const equipement = typeEquipements.value[typeIdx]?.equipements;
    if (equipement[equipementIdx]) {
        equipement[equipementIdx].linked = false;
    }

    equipementSelectionne.value[typeIdx] = "";
};

const isZoneEquipementExist = (equipement) => {
    if (equipement.linked === true || equipement.linked === false) {
        // a été modifié depuis l'interface
        return equipement.linked;
    }

    // info depuis la BdD
    return equipement.zoneEquipements.some(zoneEquipement => {
        return props.zone && props.zone === zoneEquipement.zone?.id;
    });
};

const detailsEquipement = (typeIdx, equipementIdx) => {
    detailsEquipementData.value = typeEquipements.value[typeIdx]?.equipements[equipementIdx];
    detailsEquipement_modal.value = true;
};

defineExpose({ typeEquipements });

</script>

<style scoped>
.cmp_zones_ajout_equipement {
    /* border: 1px solid darkgray;
    border-radius: 6px;
    padding: 1em; */
}

</style>