<template>
  <Card class="space-y-4">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="mb-4">RÉDUCTIONS</h1>
      </div>
    </div>
    <Spinner v-if="spinner" />
    <template v-if="!spinner">
    <table class="border border-grey-200 w-full text-left">
      <thead class="bg-gray-100">
        <tr class="rounded-t-lg">
          <th class="w-8/12">Libellé</th>
          <th class="w-1/12"></th>
          <th class="w-1/12"></th>
          <th class="w-1/12"></th>
          <th class="w-1/12"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reduc, i) in reducs" :key="`reduc-${i}`">
          <td class="w-8/12">{{ reduc.libelle }}</td>
          <td class="w-1/12 text-center">
            <Button
              icon="info"
              borderless
              couleur="secondary"
              @click="edit(reduc.reductionId)"
            />
          </td>
          <td class="w-1/12 text-center">
            <Button
              icon="edit"
              borderless
              couleur="secondary"
              @click="edit(reduc.reductionId)"
            />
          </td>
          <td class="w-1/12 text-center">
            <Button
              icon="user"
              borderless
              couleur="secondary"
              @click="edit(reduc.reductionId)"
            />
          </td>
          <!--  -->
          <td class="w-1/12 text-center">
            <Button
              icon="bad"
              borderless
              couleur="secondary"
              @click="edit(reduc.reductionId)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    </template>
  </Card>

  <!-- <ButtonRight label="Ajouter un tarif" icon="add" couleur="danger" @click="addTarif()" /> -->
</template>

<script setup lang="ts">
import Card from '@components/common/Card.vue'
import Button from '@components/common/Button.vue'
import Spinner from '@components/common/Spinner.vue'

import { getReducs } from '@api/reduc'

import 'vue3-toastify/dist/index.css'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps(['id'])
const spinner = ref(false)
const reducs = ref([])

const fetchDonnees = async () => {
  spinner.value = true
  reducs.value = await getReducs(props.id)
  spinner.value = false
}

onMounted(async () => {
  await fetchDonnees()
})

const edit = (id: number) => {
  console.log(id)
}
</script>

<style scoped>
th, td {
  padding: 10px;
  color: #000000;
}

th {
  font-weight: 700;
}

td {
  border-right: 1px solid rgb(229 231 235);
}

tr {
  border-bottom: 1px solid rgb(229 231 235);
  border-right: 1px solid rgb(229 231 235);
  border-left: 1px solid rgb(229 231 235);
}

table {
  border-radius: 50px;
}
</style>
