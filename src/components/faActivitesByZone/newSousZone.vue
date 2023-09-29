<template>
    <ButtonRight v-if="!new_sous_zone && !readonly" label="Ajouter une Sous-zone" icon="add" couleur="danger" @click="addSousZone()" id="TaddSousZone" />

    <div v-if="new_sous_zone" class="border border-gray-300 rounded-md p-4">
      <div>
        <Input v-model="new_sous_zone_libelle" label="Nom de la sous-zone" type="text" id="new_sous_zone_libelle" />
      </div>
      <div class="text-center mt-4 gap-4 flex justify-center">
        <Button label="Annuler" couleur="secondary" @click="new_sous_zone = false" />
        <Button label="Valider" couleur="danger" @click="validSousZone()" />
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import Input from '../../components/common/Input.vue'
import ButtonRight from '../../components/common/ButtonRight.vue'
import Button from '../../components/common/Button.vue'

const new_sous_zone = ref(false)
const new_sous_zone_libelle = ref('')

const emit = defineEmits(['validSousZone'])

const addSousZone = () => {
  new_sous_zone_libelle.value = ''
  new_sous_zone.value = true
}

const validSousZone = () => {
  new_sous_zone.value = false
  emit('validSousZone', new_sous_zone_libelle.value)
}
</script>