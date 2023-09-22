<template>
  <Card>
    <h1>Ouverture à distance de {{ fit_arena.libelle }}</h1>
    <!-- <pre>{{ controleAcces }}</pre> -->
    <div v-if="controleAcces !== undefined" class="flex flex-wrap mt-10 gap-6">
      <div v-for="(ca, index) in controleAcces.equipements" :key="index">
        <Button
          couleur="danger"
          :label="ca.libelle"
          @click="openCA(ca.id, ca.libelle)"
        />
      </div>
    </div>
    <div v-else class="mt-10">Aucun contrôle d'accès n'est disponible pour {{ fit_arena.libelle }}</div>
  </Card>
  <form @submit.prevent="validationOpenCA">
    <Modal
      v-if="ouvertureCA"
      title="Ouverture du contrôle d'accès"
      @cancel="ouvertureCA = false"
    >
      <p class="text-gray-900 pl-4"
        >Souhaitez-vous vraiment ouvrir le contrôle d'accès {{ controleAccesLibelle }} ?</p
      >
    </Modal>
  </form>
  <form @submit.prevent="reset">
    <Modal
      v-if="isOpening"
      title="Traitement de la demande"
      @cancel="isOpening = false"
      type="visualiser"
      cancelButtonText="OK"
    >
      <p class="text-gray-900 pl-4">{{ message }}</p>
    </Modal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import Modal from '../../components/common/Modal.vue'

import { getFitArena } from '../../api/fit-arena.js'
import { postControleAcces } from '../../api/controleAcces.js'
import { getTypeEquipements } from '@api/typeEquipement.js'

import { onMounted, ref } from 'vue'
import { useRoute } from "vue-router";

const route = useRoute()
const fitArenaId = computed(() => route.params.id)
const fit_arena = ref({})
const typeEquipements = ref({})
const controleAcces = ref({})
const ouvertureCA = ref(false)
const isOpening = ref(false)
const controleAccesId = ref(0)
const controleAccesLibelle = ref('')
const message = ref('')

onMounted(async () => {
  fit_arena.value = await getFitArena(fitArenaId.value)
  typeEquipements.value =
    await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=numerique&equipements.fitArena=' + fitArenaId.value
    )
  controleAcces.value = typeEquipements.value.find(te => te.code == 'controle_acces')
})

const openCA = (caId, caLibelle) => {
  controleAccesId.value = caId
  controleAccesLibelle.value = caLibelle
  ouvertureCA.value = true
}

const validationOpenCA = async () => {
  const data = {
    id_arena: fitArenaId.value,
    id_ca: controleAccesId.value
  }

  await postControleAcces(data).then(r => {
    if (r.statusCode == 200) {
      isOpening.value = true
      message.value = r.message
    }
  })

  ouvertureCA.value = false
  isOpening.value = true
}

const reset = () => {
  isOpening.value = false
  controleAccesId.value = 0
  controleAccesLibelle.value = ''
}
</script>
