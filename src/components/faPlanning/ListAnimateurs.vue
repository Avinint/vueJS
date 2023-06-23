<template>
  <label class="label-text">Ajouter des animateur(s) à la séance</label>
  <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
    <thead
      class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-100 dark:text-gray-700"
    >
      <tr>
        <th scope="col" class="px-6 py-3">Statut</th>
        <th scope="col" class="px-6 py-3">Nom</th>
        <th scope="col" class="px-6 py-3">Prénom</th>
        <th scope="col" class="px-6 py-3">Numéro de téléphone</th>
        <th scope="col" class="px-6 py-3">Adresse email</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(animateur, i) in seance_store.getAnimateurs"
        :key="i"
        class="bg-white"
      >
        <td class="px-6 py-4">
          <Switch v-model="seance_store.selected_animateurs[i]" />
        </td>
        <td class="px-6 py-4">{{ animateur.nom }}</td>
        <td class="px-6 py-4">{{ animateur.prenom }}</td>
        <td class="px-6 py-4">{{ animateur.telephone }}</td>
        <td class="px-6 py-4">{{ animateur.email }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Switch from '@components/common/Switch.vue'
import { useSeanceStore } from '@stores/seance'
import { ref } from 'vue';

const seance_store = useSeanceStore()
</script>
