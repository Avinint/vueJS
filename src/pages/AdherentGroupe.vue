<template>
  <Card v-if="mode === 'view'" class="space-y-4">
    <h1>Mes groupes d'Adhérents</h1>
    <Card :shadow="false" class="overflow-hidden" v-for="(groupe, key) in groupes" :key="key">
      <div class="flex items-center gap-4 mb-4">
        <LabelText :text="groupe.libelle"/>
        <Input placeholder="Rechercher"/>
        <Button couleur="secondary" label="Filtrer" />
        <Button couleur="secondary" label="Modifier le groupe" @click="editGroup(groupe)"/>
        <Button couleur="danger" label="Supprimer le groupe" @click="deleteGroupe(groupe)"/>
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
  <Card v-if="mode === 'edit'" class="space-y-4">
    <div class="flex justify-between items-center">
      <h1>{{ create ? "CREER UN GROUPE D'ADHÉRENTS" : "MODIFIER UN GROUPE D'ADHÉRENTS" }}</h1>
      <div class="flex gap-4">
        <Button couleur="secondary" label="Annuler" @click="clean"/>
        <Button label="Enregistrer" @click="save"/>
      </div>
    </div>
    <Card :shadow="false" class="overflow-hidden">
      <LabelText class="mb-4" text="VOTRE GROUPE"/>
      <form>
        <Input v-model="form.libelle" class="mb-4 max-w-xs" label="Nom du groupe"/>
        <InputOptions v-model="form.animateurs" :options="getAnimateurs()" label="Animateurs"/>
      </form>
      <template v-if="!create">
        <LabelText class="mt-4 mb-4" text="ADHÉRENTS DU GROUPE"/>
        <Table :columns="table_columns" :data="[]"/>
      </template>
    </Card>
    <Card v-if="!create" :shadow="false" class="overflow-hidden">
      <div class="flex items-center gap-4 mb-4">
        <LabelText text="LISTE DES ADHÉRENTS"/>
        <Input placeholder="Rechercher"/>
        <Button couleur="secondary" label="Filtrer" />
      </div>
      <Table :columns="table_columns" :data="[]"/>
    </Card>
  </Card>
</template>

<script setup lang="ts">
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { useRoute } from 'vue-router'
import {
deleteGroup,
  fetchGroupes, postGroup
} from '../api/groupe.js'
import InputOptions from '../components/common/InputOptions.vue'
import { onMounted, reactive, ref } from 'vue'
import 'vue3-toastify/dist/index.css'
import Table, { type FaTableColumnData } from '../components/common/Table.vue'
import { getDateDMY } from '../services/date_service'
import type { FaTableRow } from '../components/common/Table.vue'
import LabelText from '@components/common/LabelText.vue'
import { getAnimateursParOrganisme } from '@api/animateur'

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

function getAnimateurs() {
  return animateurs.value.map(animateur => {
    return {
      id: animateur.id,
      label: `${animateur.nom} ${animateur.prenom}`,
    }
  })
}

async function save() {
  const group = await postGroup({
    libelle: form.libelle,
    idOrganisme: form.idOrganisme,
    animateurs: form.animateurs.map(e => { return {id: e}}),
    adherents: form.adherents.map(e => { return {id: e.id}}),
  });

  groupes.value.push(group);
  create.value = false;
}

function deleteGroupe(groupe: Groupe) {
  deleteGroup(groupe.id).then(() => {
    for(let i = 0; i < groupes.value.length; i++) {
      if(groupe.id == groupes.value[i].id)
        groupes.value.splice(i, 1);
    }
  });
}

function clean() {
  form.animateurs = [];
  form.libelle = "";
  mode.value = 'view';
}

const mode = ref<'view' | 'edit'>('view');
const create = ref(true);
const groupes = ref<Groupe[]>([])
const animateurs = ref<Animateur[]>([])
const organismeId = ref(0)

const form = reactive<{
  libelle: string,
  idOrganisme: number,
  animateurs: number[],
  adherents: Adherent[],
}>({
  libelle: "",
  idOrganisme: 0,
  animateurs: [],
  adherents: [],
});

const route = useRoute()

onMounted(async () => {
  organismeId.value = parseInt(route.params?.id as string)
  if (organismeId.value > 0) {
    groupes.value = await fetchGroupes(organismeId.value)
    animateurs.value = await getAnimateursParOrganisme(organismeId.value);
    form.idOrganisme = organismeId.value;
  }
})

function addGroup() {
  create.value = true;
  mode.value = 'edit';
}

function editGroup(group: Groupe) {
  create.value = false;
  form.libelle = group.libelle;
  form.animateurs = group.animateurs.map(animateur => animateur.id);
  mode.value = 'edit';
}
</script>
