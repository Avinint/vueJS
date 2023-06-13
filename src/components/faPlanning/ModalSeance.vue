<template>
  <ModalBottom>
    <template #title>
      <div class="flex w-full items-center justify-between">
        <div class="modal-seance-title">
          <h2>TITLE</h2>
          <h2>DATE</h2>
        </div>
        <Button couleur="danger" borderless label="Ajouter une séance" @click="new_seance"/>
      </div>
    </template>
    <template #content>
      <div class="relative">
        <table
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
        >
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-100 dark:text-gray-700"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Horaire</th>
              <th scope="col" class="px-6 py-3">Animateur(s)</th>
              <th scope="col" class="px-6 py-3">Groupe(s)</th>
              <th scope="col" class="px-6 py-3">QR code de séance</th>
              <th scope="col" class="px-6 py-3">Modifier la séance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(seance, i) in seances" :key="i" class="bg-white">
              <td class="px-6 py-4">{{ `${seance.debut} - ${seance.fin}` }}</td>
              <td class="px-6 py-4">{{ seance.animateurs.join(', ') }}</td>
              <td class="px-6 py-4">{{ seance.groupes.join(', ') }}</td>
              <td class="px-6 py-4">QR CODE</td>
              <td class="px-6 py-4">MODIFIER</td>
            </tr>
          </tbody>
        </table>
      </div>
      <EditSeance ref="edit_seance" :mode="edit_mode"/>
    </template>
  </ModalBottom>
</template>

<script setup lang="ts">
import ModalBottom from '@components/common/ModalBottom.vue'
import EditSeance from '@components/faPlanning/EditSeance.vue'
import Button from '@components/common/Button.vue'
import { ref } from 'vue';

const edit_mode = ref<"create" | "edit">("create");
const edit_seance = ref<InstanceType<typeof EditSeance>>();

const seances = [
  {
    debut: '10:00',
    fin: '11:00',
    animateurs: ['Loïc', 'Quentin'],
    groupes: ['U12', 'U14'],
    QR: '',
  },
]

function new_seance() {
    if(edit_seance.value) {
        edit_seance.value.open_panel();
    }
}
</script>

<style scoped>
.modal-seance-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  margin-left: 50px;
}

.modal-seance-title :nth-child(1) {
  position: relative;
}
.modal-seance-title h2 {
  font-size: 18px;
}

.modal-seance-title :nth-child(1)::before {
  content: '';
  position: absolute;
  width: 1.5px;
  height: 100%;
  right: -10px;
  background-color: red;
}

.modal-seance-title::before {
  content: '';
  position: absolute;
  left: calc(0px - 50px);
  top: 50%;
  background-color: red;
  width: 40px;
  height: 1.5px;
}
</style>
