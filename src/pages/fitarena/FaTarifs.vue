<template>
  <Card class="space-y-4">
    <div class="">
      <h1 class="mb-4">TARIFS</h1>
      <h2>Niv 1, Prio 1 = le plus prioritaire</h2>
    </div>
    <Card
      :shadow="false"
      class="overflow-hidden"
      v-for="(activite, key) in tarifsByActivities"
      :key="`activite-${key}`"
      :boxShadow="false"
    >
      <div class="mb-4 flex items-center justify-between">
        <LabelText :text="activite.activite" class="label-text" />
        <ButtonRight label="Ajouter un tarif" icon="add" couleur="danger" @click="addTarif()" />
      </div>
      <div v-for="(tarifs, i) in activite.tarifs" :key="`tarifs-${i}`">
        <h3 class="font-bold text-sm mb-2">{{ tarifs.niveau }} : {{ tarifs.type }}</h3>
        <table class="w-full text-left mb-10 rounded-lg">
          <thead class="bg-gray-200 text-sm">
            <tr>
              <th style="width:1%;">Prio</th>
              <th style="width:10%;">Statut</th>
              <th style="width:20%;">Nom du tarif</th>
              <th style="width:10%;">Tarif</th>
              <th style="width:20%;" /> <!-- plage horaire -->
              <th style="width:20%;" /> <!-- jours -->
              <th style="width:16%;" /> <!-- date début - date fin -->
              <th style="width:1%;" /> <!-- accordéon pour détails périodes -->
              <th style="width:1%;" /> <!-- modification (ouverture modal) -->
              <th style="width:1%;" /> <!-- drag and drop -->
            </tr>
          </thead>
          <!-- <draggable v-model="list" ghost-class="ghost" tag="tbody" :disabled="!enabled" @start="dragging = true" @end="dragging = false">
            <template #item="{ element }" :key="element.id">
              <tr>
                <td>{{ element.priorite }}</td>
                <td>{{ element.actif }}</td>
                <td>{{ element.nom }}</td>
                <td>{{ element.tarif }}</td>
              </tr>
            </template>
          </draggable> -->
          <!-- <tbody>
            <template v-for="(tarif, i) in tarifs.tarifs" :key="`tarif-${i}`">
              <tr>
                <td class="text-center">{{ tarif.priorite }}</td>
                <td class="flex gap-6 mt-2">
                  <p class="statut-tarif">{{ tarif.actif ? 'Actif' : 'Inactif' }}</p>
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input
                      v-model="tarif.actif"
                      type="checkbox"
                      value="true"
                      class="peer sr-only"
                      @change="modifieTarif(i)"
                    />
                    <div
                      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                    ></div>
                    <span
                      class="ml-3 text-sm font-medium text-gray-900"
                    ></span>
                  </label>
                </td>
                <td>{{ tarif.nom }}</td>
                <td>{{ tarif.tarif }}</td>
                <td />
                <td />
                <td />
                <td class="text-center">
                  <div class="px-3">
                    <InfoSVG :open="tarif.open" @click="openTarif(tarif)" class="cursor-pointer" />
                  </div>
                </td>
                <td>
                  <Button
                    icon="edit"
                    borderless
                    couleur="secondary"
                    @click="editTarif(i)"
                  />
                </td>
                <td>
                  <div class="border-t border-b border-black h-2 w-4 px-2" />
                </td>
              </tr>
              <template v-if="tarif.open">
                <template v-for="(periode, i) in tarif.periodes" :key="`periode-${i}`">
                  <tr>
                    <td colspan="4" />
                    <td>{{ periode.plage_horaire }}</td>
                    <td>{{ periode.jours.join(' - ') }}</td>
                    <td>{{ periode.date_debut }} - {{ periode.date_fin }}</td>
                    <td colspan="3" />
                  </tr>
                </template>
              </template>
            </template>
          </tbody> -->
        </table>
      </div>
    </Card>
  </Card>

  <draggable v-model="list" ghost-class="ghost" :disabled="!enabled" @start="dragging = true" @end="dragging = false">
    <template #item="{ element }" :key="element.id">
      <tr>
        <td>{{ element.priorite }}</td>
        <td>{{ element.actif }}</td>
        <td>{{ element.nom }}</td>
        <td>{{ element.tarif }}</td>
      </tr>
    </template>
  </draggable>

  <!-- <form @submit.prevent="saveTarif">
    <Modal
      v-if="espace_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="espace_modal = false"
    >
      <div class="pl-4">
        <MentionChampsObligatoires />
      </div>
    </Modal>
  </form> -->
  <!-- <form @submit.prevent="deleteMemberGroupValidation(deleteMemberGroupId)">
    <ValidationModal
      v-if="delete_modal"
      type="delete"
      @cancel="delete_modal = false"
    >
    </ValidationModal>
  </form> -->
</template>

<script setup lang="ts">
import Card from '@components/common/Card.vue'
import Button from '@components/common/Button.vue'
import Input from '@components/common/Input.vue'
import ValidationModal from '@components/common/ValidationModal.vue'
import ButtonRight from '@components/common/ButtonRight.vue'
import LabelText from '@components/common/LabelText.vue'
import InfoSVG from "@components/svg/InfoSVG.vue"

import { getTarifs } from '@api/tarifs'

import 'vue3-toastify/dist/index.css'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import draggable from 'vuedraggable'

const props = defineProps(['id'])
const route = useRoute()
const tarifsByActivities = ref([])
const openModal = ref(false)
const dragging = ref(false)
const enabled = true

const list = [
  {
    priorite: 1,
    actif: true,
    nom: 'TEst',
    tarif: 'TEST TEST VACANCES'
  },
  {
    priorite: 1,
    actif: true,
    nom: 'fjekz ',
    tarif: 'SEMAINE'
  }
]

const fetchDonnees = async () => {
  tarifsByActivities.value = await getTarifs({ idFitArena: props.id, page: 1 })
  tarifsByActivities.value = tarifsByActivities.value.map(tarif => ({ ...tarif, open: false }))
}

onMounted(async () => await fetchDonnees())

watch(() => route.params?.id, async() => await fetchDonnees())

const modifieTarif = async (i :number) => {
  console.log(`modifier actif / inactif du tarif ${i}`)
}

const editTarif = (i :number) => {
  openModal.value = true
}

const addTarif = () => {
  openModal.value = true
  console.log('créer un tarif')
}

const openTarif = (tarif :object) => {
  tarif.open = !tarif.open
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

.label-text {
  font-size: 22px;
}

p.statut-tarif {
  min-width: 45px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
