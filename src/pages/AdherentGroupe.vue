<template>
  <Card class="space-y-4">
    <h1> Mes groupes d'Adhérents</h1>
    <Card :shadow="false" class="overflow-hidden" v-for="(groupe, key) in groupes" :key="key">
      <div class="flex items-center gap-4 mb-4">
        <LabelText :text="groupe.libelle"/>
        <Input placeholder="Rechercher"/>
        <Button couleur="secondary" label="Filtrer" />
        <Button couleur="secondary" label="Modifier le groupe" @click="editGroup(groupe)"/>
      </div>
      <Table :columns="table_columns" :data="getGroupTableData(groupe)"/>
    </Card>
    <Button
      id="TaddGroupe"
      label="Ajouter un Groupe"
      icon="add"
      couleur="secondary"
      @click="addGroup"
    />
  </Card>
</template>

<script setup lang="ts">
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { useRoute } from 'vue-router'
import {
  fetchGroupes
} from '../api/groupe.js'

import { onMounted, ref } from 'vue'
import 'vue3-toastify/dist/index.css'
import Table, { type FaTableColumnData } from '../components/common/Table.vue'
import { getDateDMY } from '../services/date_service'
import type { FaTableRow } from '../components/common/Table.vue'
import LabelText from '@components/common/LabelText.vue'

const table_columns: FaTableColumnData<Adherent>[] = [
  {label: 'Nom et Prénom', data: e => `${e.nom} ${e.prenom}`},
  {label: 'Date de naissance', data: e => getDateDMY(e.dateNaissance)},
  {label: "Numéro d'adhérent", data: e => e.numeroAdherent},
  {label: "Date d'adhésion", data: e => getDateDMY(e.dateAdhesion)},
  {label: "Date de fin d'adhésion", data: e => getDateDMY(e.dateFinAdhesion)},
  {label: "Groupes", data: e => e.groupes.map(g => g.libelle).join(', ')}
]

function getGroupTableData(groupe: Groupe): FaTableRow<Adherent>[] {
  return groupe.adherents.map(adherent => {
    return {
      data: adherent,
      editable: false,
      removable: false,
    }
  })
}

const mode = ref<'add' | 'edit' | 'delete'>('add');
const groupes = ref<Groupe[]>([])
const organismeId = ref(0)

const route = useRoute()

onMounted(async () => {
  organismeId.value = parseInt(route.params?.id as string)
  if (organismeId.value > 0) {
    groupes.value = await fetchGroupes(organismeId.value)
    console.log(groupes.value)
  }
})

function addGroup() {

}

function editGroup(group: Groupe) {

}
</script>
