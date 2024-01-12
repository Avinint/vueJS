<template>
  <ButtonRight icon="filter" label="Filtrer" couleur="secondary" @click="afficherCalqueRecherche = true" />
  <Modal v-if="afficherCalqueRecherche" title="FILTRE DEMANDE" @cancel="afficherCalqueRecherche = false" @confirm="filtrer" confirmButtonText="Filtrer">
    <template #actions>
      <Button test='TresetRechDmd' @click="resetRecherche" label="reset" couleur="danger" />
    </template>
    <div class="pl-4">
      <CardModalSection title="CRITÈRES DU FILTRE">
        <template #content>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Organisme</p>
            <select
              id="TrechDmdSelectOrganisme"
              v-model="recherche.organisme"
              class="block w-48 rounded-lg w-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
              <option v-for="(organisme, i) in selectOrganismes" :key="i" :value="organisme.id">
                {{ organisme.libelle }}
              </option>
            </select>
          </div>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Statut de la demande</p>
            <select
              id="TrechDmdSelectStatut"
              v-model="recherche.statut"
              class="block w-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option v-for="(statut, i) in selectStatuts" :key="`statutDemande-${i}`" :value="statut.id">
                {{ statut.libelle }}
              </option>
            </select>
          </div>
        </template>
      </CardModalSection>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import ButtonRight from "@components/common/ButtonRight.vue";
import Modal from "@components/common/Modal.vue";
import CardModalSection from '@components/common/CardModalSection.vue'

import { useMenuStore } from "@stores/menu";

import { computed, reactive, ref, defineEmits, onMounted } from "vue";

const { getOrganismes } = useMenuStore()
const selectOrganismes = computed(() => getOrganismes().map(({id, libelle}) => ({id, libelle})))
const selectStatuts = ref([
  {
    id: 1,
    libelle: "Validé",
    code: 'valide'
  },
  {
    id: 2,
    libelle: "Demandé",
    code: 'demande'
  },
  {
    id: 3,
    libelle: "Conflit",
    code: 'conflit'
  },
  {
    id: 4,
    libelle: "Annulé",
    code: 'annule'
  },
  {
    id: 5,
    libelle: "Rejeté",
    code: 'rejete'
  }
])
const rechercheDefauts = reactive({
  organisme: null,
  statut: null
})
const recherche = reactive({...rechercheDefauts})
const afficherCalqueRecherche = ref(false)
const rechercheQuery = computed(() => ({
  idOrganisme: recherche.organisme ?? null,
  statutDemande: recherche.statut ?? null,
}))

const filtrer =  async() => {
  emit('chargementListe', rechercheQuery.value)
  afficherCalqueRecherche.value = false
}

const resetRecherche = async() => {
  Object.assign(recherche, rechercheDefauts)
  emit('chargementListe', {})
}

const emit = defineEmits(['chargementListe'])
</script>

<style scoped>
.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>