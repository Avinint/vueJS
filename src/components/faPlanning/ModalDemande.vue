<template>
  <Modal
    @cancel="state = 'closed'"
    v-if="state != 'closed'"
    size="5xl"
    type="none"
    title="Demande de créations de créneaux"
  >
    <Input class="max-w-lg" label="Titre du créneau" v-model="form.title" />
    <div class="flex gap-16">
      <InputDate label="Date du créneau" v-model="form.date" />
      <TimeRange label="Plage horaire du créneau" v-model:start_time="form.start_time" v-model:end_time="form.end_time"/>
    </div>
    <Button label="Récurrence (WIP)" couleur="secondary" />
    <div class="flex items-center gap-4">
      <p>Nombre de persones attendues</p>
      <Input class="input-count" v-model="form.people_count" />
    </div>
    <h2>Zones</h2>
    <InputOptions :options="zones" v-model="form.zones" />
    <h2>Écrire un commentaire</h2>
    <Card :shadow="false">WIP</Card>
    <div class="h-30 flex h-full justify-center">
      <Button @click="submit" label="Demander une validation" couleur="danger" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import Card from '@components/common/Card.vue'
import Input from '@components/common/Input.vue'
import InputDate from '@components/common/InputDate.vue'
import InputOptions from '@components/common/InputOptions.vue'
import Modal from '@components/common/Modal.vue'
import TimeRange from '@components/molecules/TimeRange.vue'
import type { DateSelectArg } from '@fullcalendar/core'
import { extractHour, parseDateToInput } from '../../services/date_service'
import { reactive, ref } from 'vue'
import { makeDemandeEditContract } from '@services/planning/creneau_service'
import { postCreneauDemande } from '@api/creneau'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute();

const default_form_values = {
  title: '',
  date: '',
  start_time: '',
  end_time: '',
  people_count: '0',
  zones: [],
}

const form = reactive<{
  title: string,
  date: string,
  start_time: string,
  end_time: string,
  people_count: string,
  zones: number[],
}>({ ...default_form_values })

defineExpose({ create })
const state = ref<'create' | 'edit' | 'closed'>('closed')
const zones = [
  { id: 0, label: 'Halle multisport' },
  { id: 1, label: 'Tennis' },
  { id: 2, label: 'Golf' },
  { id: 3, label: 'Escalade' },
  { id: 4, label: 'Basket 3x3' },
]

function create(event: DateSelectArg) {
  state.value = 'create'
  form.title = default_form_values.title;
  form.people_count = default_form_values.people_count;
  form.zones = default_form_values.zones;
  form.date = parseDateToInput(event.start)
  form.start_time = extractHour(event.start)
  form.end_time = extractHour(event.end)
}

async function submit() {
  state.value = 'closed';
  for(let i = 0; i < form.zones.length; i++) {
    let organisme_id = route.params.org_id as string;
    const contract = makeDemandeEditContract(form.zones[i], parseInt(organisme_id), form); 
    const response = await postCreneauDemande(contract);
  }
  
}
</script>

<style scoped>
.input-count {
  max-width: 47px;
}
</style>
