<template>
  <Card v-if="mode === 'view'" class="space-y-4">
    <h1>Mes groupes d'Adhérents</h1>
    <Card
      :shadow="false"
      class="overflow-hidden"
      v-for="(groupe, key) in groupes"
      :key="key"
    >
      <div class="mb-4 flex items-center gap-4">
        <LabelText :text="groupe.libelle" />
        <Input placeholder="Rechercher" />
        <Button couleur="secondary" label="Filtrer" />
        <Button
          couleur="secondary"
          label="Modifier le groupe"
          @click="editGroup(groupe)"
        />
        <Button
          couleur="danger"
          label="Supprimer le groupe"
          @click="deleteGroupe(groupe)"
        />
      </div>
      <Table :columns="table_columns" :data="getGroupTableData(groupe)" />
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
    <div class="flex items-center justify-between">
      <h1>
        {{
          create
            ? "CREER UN GROUPE D'ADHÉRENTS"
            : "MODIFIER UN GROUPE D'ADHÉRENTS"
        }}
      </h1>
      <div class="flex gap-4">
        <Button couleur="secondary" label="Annuler" @click="clean" />
        <Button label="Enregistrer" @click="save" />
      </div>
    </div>
    <Card :shadow="false" class="overflow-hidden">
      <LabelText class="mb-4" text="VOTRE GROUPE" />
      <form>
        <Input
          v-model="form.libelle"
          class="mb-4 max-w-xs"
          label="Nom du groupe"
        />
        <InputOptions
          v-model="form.animateurs"
          :options="getAnimateurs()"
          label="Animateurs"
        />
      </form>
      <template v-if="!create">
        <LabelText class="mb-4 mt-4" text="ADHÉRENTS DU GROUPE" />
        <Table
          :columns="table_columns"
          :data="adherents_groupe"
          removable
          @entity:remove="removeAdherent"
        />
      </template>
    </Card>
    <Card v-if="!create" :shadow="false" class="overflow-hidden">
      <div class="mb-4 flex items-center gap-4">
        <LabelText text="LISTE DES ADHÉRENTS" />
        <Input placeholder="Rechercher" />
        <Button couleur="secondary" label="Filtrer" />
      </div>
      <div v-if="selected_adherents.length > 0" class="mb-4 flex items-center gap-4">
        <p
          class="rounded-lg border px-3 py-2 text-sm font-bold text-blue-300"
        >
          {{ `${selected_adherents.length} éléments` }}
        </p>
        <Button
          couleur="secondary"
          label="Ajouter au groupe"
          @click="addAdherents"
        />
      </div>
      <Table
        selectable
        :columns="table_columns"
        :data="getAdherentsData()"
        v-model:selected="selected_adherents"
      />
    </Card>
  </Card>
</template>

<script setup lang="ts">
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { useRoute } from 'vue-router'
import { deleteGroup, fetchGroupes, postGroup, putGroup } from '../api/groupe'
import InputOptions from '../components/common/InputOptions.vue'
import { onMounted, reactive, ref } from 'vue'
import 'vue3-toastify/dist/index.css'
import Table, { type FaTableColumnData } from '../components/common/Table.vue'
import { getDateDMY } from '../services/date_service'
import type { FaTableRow } from '../components/common/Table.vue'
import LabelText from '@components/common/LabelText.vue'
import { getAnimateursParOrganisme } from '@api/animateur'
import { getAdherentsParOrganisme } from '@api/adherent'
import {toast} from "vue3-toastify";

const table_columns: FaTableColumnData<Adherent>[] = [
  { label: 'Nom et Prénom', data: (e) => `${e.nom} ${e.prenom}` },
  { label: 'Date de naissance', data: (e) => getDateDMY(e.dateNaissance) },
  { label: "Numéro d'adhérent", data: (e) => e.numeroAdherent },
  { label: "Date d'adhésion", data: (e) => getDateDMY(e.dateAdhesion) },
  {
    label: "Date de fin d'adhésion",
    data: (e) => getDateDMY(e.dateFinAdhesion),
  },
  { label: 'Groupes', data: (e) => e.groupes.map((g) => g.libelle).join(', ') },
]

const mode = ref<'view' | 'edit'>('view')
const create = ref(true)
const groupes = ref<Groupe[]>([])
const animateurs = ref<Animateur[]>([])
const adherents = ref<Adherent[]>([])
const selected_adherents = ref<FaTableRow<Adherent>[]>([])
const adherents_groupe = ref<FaTableRow<Adherent>[]>([])
const organismeId = ref(0)
const group_id = ref(0)

const form = reactive<{
  libelle: string
  animateurs: number[]
  adherents: Adherent[]
}>({
  libelle: '',
  animateurs: [],
  adherents: [],
})

const route = useRoute()

onMounted(async () => {
  organismeId.value = parseInt(route.params?.id as string)
  if (organismeId.value != 0) {
    groupes.value = await fetchGroupes(organismeId.value)
    animateurs.value = await getAnimateursParOrganisme(organismeId.value)
    adherents.value = await getAdherentsParOrganisme(organismeId.value)
  }
})

function removeAdherent(entity: Adherent) {
  for (let i = 0; i < adherents_groupe.value.length; i++) {
    const element = adherents_groupe.value[i]
    if (element.data.id == entity.id) {
      adherents_groupe.value.splice(i, 1)
    }
  }
}

function addAdherents() {
  for (let i = 0; i < selected_adherents.value.length; i++) {
    const exist = adherents_groupe.value.find(
      (e) => e.id == selected_adherents.value[i].id
    )
    if (!exist) {
      adherents_groupe.value.push(selected_adherents.value[i])
    }
  }
}

function getAdherentsData(): FaTableRow<Adherent>[] {
  return adherents.value.map((adherent) => {
    return {
      id: adherent.id,
      editable: false,
      removable: true,
      data: adherent,
    }
  })
}

function addGroup() {
  create.value = true
  mode.value = 'edit'
}

function editGroup(group: Groupe) {
  create.value = false
  group_id.value = group.id
  form.libelle = group.libelle
  form.animateurs = group.animateurs.map((animateur) => animateur.id)
  form.adherents = group.adherents
  adherents_groupe.value = group.adherents.map((adherent) => {
    return {
      id: adherent.id,
      data: adherent,
      editable: false,
      removable: true,
    }
  })
  mode.value = 'edit'
}

function getGroupTableData(groupe: Groupe): FaTableRow<Adherent>[] {
  return groupe.adherents.map((adherent) => {
    return {
      id: adherent.id,
      data: adherent,
      editable: false,
      removable: false,
    }
  })
}

function getAnimateurs() {
  return animateurs.value.map((animateur) => {
    return {
      id: animateur.id,
      label: `${animateur.nom} ${animateur.prenom}`,
    }
  })
}

async function save() {
  const contract = {
    libelle: form.libelle,
    idOrganisme: organismeId.value,
    animateurs: form.animateurs.map((e) => {
      return { id: e }
    }),
    adherents: adherents_groupe.value.map((e) => {
      return { id: e.data.id }
    }),
  }

  try {
    if (create.value === true) {
      const group = await postGroup(contract)
      groupes.value.push(group)
      group_id.value = group.id;
      create.value = false
      toast.success("Création effectuée avec succès.")
    } else {
      await putGroup(group_id.value, contract)
      toast.success("Modification effectuée avec succès.")
      groupes.value = await fetchGroupes(organismeId.value)
      mode.value = 'view';
    }
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur.')
  }

}

async function deleteGroupe(groupe: Groupe) {
  deleteGroup(groupe.id).then(() => {
    for (let i = 0; i < groupes.value.length; i++) {
      if (groupe.id == groupes.value[i].id) groupes.value.splice(i, 1)
    }
  })
  groupes.value = await fetchGroupes(organismeId.value)
}

function clean() {
  form.animateurs = []
  form.libelle = ''
  mode.value = 'view'
}
</script>
