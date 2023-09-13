<template>
  <Card>
    <h1>Ouverture à distance de {{ fit_arena.libelle }}</h1>
    <!-- <pre>{{ controleAcces }}</pre> -->
    <div v-if="controleAcces !== undefined" class="flex flex-wrap mt-10 gap-10">
      <div v-for="(ca, index) in controleAcces.equipements" :key="index">
        <Button
          couleur="danger"
          :label="ca.libelle"
          @click="openCA(ca.id)"
        />
      </div>
    </div>
    <div v-else class="mt-10">Aucun contrôle d'accès n'est disponible pour {{ fit_arena.libelle }}</div>
  </Card>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'

import { getFitArena } from '../../api/fit-arena.js'
import { postControleAcces } from '../../api/controleAcces.js'
import { getTypeEquipements } from '@api/typeEquipement.js'

import { onMounted, ref } from 'vue'
import { useRoute } from "vue-router";

const fit_arena = ref({})
const fitArenaId = parseInt(useRoute().params.id)
const typeEquipements = ref({})
const controleAcces = ref({})

onMounted(async () => {
  fit_arena.value = await getFitArena(fitArenaId)
  typeEquipements.value =
    await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=numerique&equipements.fitArena=' + fitArenaId
    )
  controleAcces.value = typeEquipements.value.find(te => te.code == 'control-acces')
})

const openCA = async (caId) => {
  const data = {
    id_arena: 4,
    id_ca: 2
  }
  await postControleAcces(data)
}
</script>
