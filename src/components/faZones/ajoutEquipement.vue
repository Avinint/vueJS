<template>
    Ajout d'équipements {{ typeEquipementTextes }}

    <div v-for="(type, typeIdx) in typeEquipements">
        <p style="font-weight: 700;">{{ type.libelle }}</p>
        <div >
            <ul>
                <template v-for="(equipement, equipementIdx) in type.equipements">
                    <li v-if="isZoneEquipementExist(equipement)">
                        {{ equipement.id }} {{ equipement.libelle }}
                        <Button borderless icon="delete" type="secondary" @click.prevent="removeEquipementFromZone(typeIdx, equipementIdx)"/>
                    </li>
                </template>
            </ul>

            <select v-model="equipementSelectionne[typeIdx]" @change="addEquipementToZone(typeIdx)">
                <option value="" selected="selected">Ajouter</option>
                <template v-for="(equipement, equipementIdx) in type.equipements">
                    <option v-if="!isZoneEquipementExist(equipement)" :value="equipementIdx">{{ equipement.libelle }}</option>
                </template>
            </select>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getTypeEquipements } from '../../api/typeEquipement';
import Button from '../../components/common/Button.vue';

const props = defineProps({
    typeEquipement: String,
    fa: Number,
    zone: Number,
});

const typeEquipements = ref([]);
const typeEquipementTextes = ref('');
const equipementSelectionne = ref([]);

onMounted(async () => {

    console.debug("props.zone",props.zone);

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

defineExpose({ typeEquipements });

</script>

<style scoped></style>