<template>
  <CardModalSection :title="`Ajout d'équipements ${typeEquipementTextes}`" class="py-4 border border-gray-200 rounded-lg my-4">
    <div
      v-for="(type, typeIdx) in typeEquipements"
      :key="typeIdx"
      class="pl-8"
    >
      <table class="w-full text-left text-sm text-gray-500 border-separate border-spacing-y-2">
        <thead
          class="text-xs text-gray-700 bg-gray-200"
        >
          <tr>
            <th scope="col" class="px-6 py-3">{{ type.libelle }}</th>
            <th scope="col" class="px-6 py-3">Adresse IP</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody v-for="(equipement, equipementIdx) in type.equipements" :key="equipementIdx">
          <tr v-if="isZoneEquipementExist(equipement)" class="bg-white">
            <td class="px-6 py-2 bg-blue text-white rounded-lg">{{ equipement.libelle }}</td>
            <td class="px-6 py-2">{{ equipement.ip }}</td>
            <td class="flex items-center justify-end p-3 gap-10">
              <Button
                v-if="!readonly"
                borderless
                icon="delete"
                couleur="secondary"
                @click.prevent="removeEquipementFromZone(typeIdx, equipementIdx)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <select
        v-if="!readonly"
        v-model="equipementSelectionne[typeIdx]"
        class="mt-2 block w-3/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
  </CardModalSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getTypeEquipements } from '../../api/typeEquipement'
import Button from '../../components/common/Button.vue'
import CardModalSection from '@components/common/CardModalSection.vue'

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

<style scoped>
.bg-blue {
  background-color: #3586E2;
}
</style>
