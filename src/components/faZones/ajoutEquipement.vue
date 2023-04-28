<template>
  <div class="rounded-md border border-gray-300 p-4">
    <h2 class="pb-5 pt-2 text-lg">
      Ajout d'équipements {{ typeEquipementTextes }}
    </h2>

    <div
      v-for="(type, typeIdx) in typeEquipements"
      :key="typeIdx"
      class="pb-5 pt-2"
    >
      <h2 class="pb-5 pt-2">{{ type.libelle }}</h2>
      <div>
        <template
          v-for="(equipement, equipementIdx) in type.equipements"
          :key="equipementIdx"
        >
          <div
            v-if="isZoneEquipementExist(equipement)"
            class="flex items-center justify-between"
          >
            {{ equipement.libelle }}
            <div class="flex">
              <Button
                label="Détails"
                type="secondary"
                class="mr-4"
                @click="detailsEquipement(typeIdx, equipementIdx)"
              />
              <Button
                v-if="!readonly"
                borderless
                icon="delete"
                type="secondary"
                @click.prevent="
                  removeEquipementFromZone(typeIdx, equipementIdx)
                "
              />
            </div>
          </div>
        </template>

        <select
          v-if="!readonly"
          v-model="equipementSelectionne[typeIdx]"
          class="mt-2 block w-1/3 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          @change="addEquipementToZone(typeIdx)"
        >
          <option value="" selected="selected">Ajouter</option>
          <template
            v-for="(equipement, equipementIdx) in type.equipements"
            :key="equipementIdx"
          >
            <option
              v-if="!isZoneEquipementExist(equipement)"
              :value="equipementIdx"
            >
              {{ equipement.libelle }}
            </option>
          </template>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getTypeEquipements } from '../../api/typeEquipement'
import Button from '../../components/common/Button.vue'

const props = defineProps({
  typeEquipement: String,
  fa: Number,
  zone: Number,
  readonly: Boolean,
})

const typeEquipements = ref([])
const typeEquipementTextes = ref('')
const equipementSelectionne = ref([])

const emit = defineEmits(['openModalDetails'])

onMounted(async () => {
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=' +
      props.typeEquipement +
      '&equipements.fitArena=' +
      props.fa
  )

  if (props.typeEquipement === 'numerique') {
    typeEquipementTextes.value = 'numériques'
  } else if (props.typeEquipement === 'motorise') {
    typeEquipementTextes.value = 'motorisés'
  }

  // fixer valeurs par défaut pour les <select>
  equipementSelectionne.value = Array(typeEquipements.value.length).fill('')
})

onUnmounted(async () => {})

const addEquipementToZone = (typeIdx) => {
  const equipement = typeEquipements.value[typeIdx].equipements
  const equipementIdx = equipementSelectionne.value[typeIdx]
  if (equipement[equipementIdx]) {
    equipement[equipementIdx].linked = true
  }

  equipementSelectionne.value[typeIdx] = ''
}

const removeEquipementFromZone = (typeIdx, equipementIdx) => {
  const equipement = typeEquipements.value[typeIdx]?.equipements
  if (equipement[equipementIdx]) {
    equipement[equipementIdx].linked = false
  }

  equipementSelectionne.value[typeIdx] = ''
}

const isZoneEquipementExist = (equipement) => {
  if (equipement.linked === true || equipement.linked === false) {
    // a été modifié depuis l'interface
    return equipement.linked
  }

  // info depuis la BdD
  return equipement.zoneEquipements.some((zoneEquipement) => {
    return props.zone && props.zone === zoneEquipement.zone?.id
  })
}

const detailsEquipement = (typeIdx, equipementIdx) => {
  emit(
    'openModalDetails',
    typeEquipements.value[typeIdx]?.equipements[equipementIdx]
  )
}

defineExpose({ typeEquipements })
</script>

<style scoped></style>
