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
        <table class="w-full text-left mb-10">
          <thead class="bg-gray-200 text-sm">
            <tr>
              <th style="width:1%;" />
              <th style="width:1%;">Prio</th>
              <th style="width:10%;">Statut</th>
              <th style="width:20%;">Nom du tarif</th>
              <th style="width:10%;">Tarif</th>
              <th style="width:20%;">Plages horaires</th>
              <th style="width:20%;">Jours</th>
              <th style="width:14%;">Dates</th>
              <th style="width:2%;" />
              <th style="width:2%;" />
            </tr>
          </thead>
          <tbody>
            <template v-for="(tarif, i) in tarifs.tarifs" :key="`tarif-${i}`">
              <tr>
                <td class="text-center">
                  <ChevronSVG :open="tarif.open" :visible="tarif.periodes.length > 1" @openMenuItem="openTarif(tarif)" />
                </td>
                <td class="text-center">{{ tarif.priorite }}</td>
                <td class="flex gap-6">
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
                <td>{{ tarif.periodes[0].plage_horaire }}</td>
                <td>{{ tarif.periodes[0].jours.join(' - ') }}</td>
                <td>{{ tarif.periodes[0].date_debut }} - {{ tarif.periodes[0].date_fin }}</td>
                <td>
                  <Button
                    icon="edit"
                    borderless
                    couleur="secondary"
                    @click="editTarif(i)"
                  />
                </td>
                <td>
                  <Button
                    icon="delete"
                    borderless
                    couleur="secondary"
                    @click="deleteTarif(i)"
                  />
                </td>
              </tr>
              <template v-if="tarif.open">
                <template v-for="(periode, i) in tarif.periodes" :key="`periode-${i}`">
                  <tr v-if="i > 0">
                    <td colspan="5" />
                    <td>{{ periode.plage_horaire }}</td>
                    <td>{{ periode.jours.join(' - ') }}</td>
                    <td>{{ periode.date_debut }} - {{ periode.date_fin }}</td>
                    <td colspan="2" />
                  </tr>
                </template>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </Card>
  </Card>

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
import ChevronSVG from "@components/svg/ChevronSVG.vue"

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

const fetchDonnees = async () => {
  tarifsByActivities.value = await getTarifs({ idFitArena: props.id, page: 1 })
  tarifsByActivities.value = tarifsByActivities.value.map(tarif => ({ ...tarif, open: false }))
}

onMounted(async () => await fetchDonnees())

watch(() => route.params?.id, async() => await fetchDonnees())

const modifieTarif = async (i :number) => {
  console.log(`modifier actif / inactif du tarif ${i}`)
}

const deleteTarif = async (i :number) => {
  console.log(`delete actif / inactif du tarif ${i}`)
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
