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
        <h3 class="font-bold text-sm mb-2">{{ tarifs.niveau }} : Tarif {{ tarifs.type }}</h3>
        <table class="w-full text-left mb-10 rounded-lg">
          <thead class="bg-gray-200 text-sm">
            <tr>
              <th style="width:1%;">Prio</th>
              <th style="width:10%;">Statut</th>
              <th style="width:20%;">Nom du tarif</th>
              <th style="width:15%;">Tarif</th>
              <th style="width:15%;" /> <!-- plage horaire -->
              <th style="width:20%;" /> <!-- jours -->
              <th style="width:16%;">Périodes</th> <!-- date début - date fin -->
              <th style="width:1%;" /> <!-- accordéon pour détails périodes -->
              <th style="width:1%;" /> <!-- modification (ouverture modal) -->
              <th style="width:1%;" /> <!-- bouton drag and drop (toute la row sera sélectionnable) -->
            </tr>
          </thead>
          <tbody class="sortable-list">
            <template v-for="(tarif, i) in tarifs.tarifs" :key="`tarif-${i}`">
              <tr class="item" :id="tarif.id">
                <td class="text-center">{{ tarif.priorite }}</td>
                <td class="flex gap-6 mt-1">
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
                <td>{{ Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tarif.tarif / 100) }} / {{ tarif.duree }} min</td>
                <td />
                <td />
                <td>{{ tarif.periodes.length }} période(s)</td>
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
                    <td>{{ periode.plageHoraireDebut.split(':')[0] }}:{{ periode.plage_horaire_debut.split(':')[1] }} à {{ periode.plage_horaire_fin.split(':')[0] }}:{{ periode.plage_horaire_fin.split(':')[1] }}</td>
                    <td>{{ periode.jours.join(' - ') }}</td>
                    <td>{{ periode.date_debut }} - {{ periode.date_fin }}</td>
                    <td colspan="3" />
                  </tr>
                </template>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </Card>
  </Card>

  <form @submit.prevent="saveTarif">
    <Modal
      v-if="openModal"
      title="Édition de tarif"
      size="4xl"
      @cancel="openModal = false"
    >
      <CardModalSection title="Activité et tarif" :params="true">
        <template #topParams>
          <div class="flex gap-6 ml-96">
            <p class="w-10">{{ tarif.actif ? 'Actif' : 'Inactif' }}</p>
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
          </div>
        </template>
        <div class="flex items-center gap-8">
          <FAInput
            v-model="tarif.titre"
            :inline="false"
            :required="true"
            label="Ajouter un titre à votre tarif"
            class="w-1/2"
            placeholder="Titre tarif"
            type="text"
          />
          <InputSelect
            v-model="tarif.activite"
            :required="true"
            label="Choisir l'activité"
            class="w-1/2"
            :options="getActivities"
          />
        </div>
        <div class="flex gap-6 mt-10 items-center">
          <p class="text-black">Tarif pour</p>
          <select
            :value="tarif.duree"
            required
            class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option
              v-for="(duree, i) in listDuree"
              :key="i"
              :value="duree"
            >
              {{ duree }}
            </option>
          </select>
          <div class="relative flex">
            <Input
              id="montantTarif"
              v-model="tarif.montant"
              type="text"
              placeholder="Montant"
              class="w-20"
              required
            />
            <p class="absolute top-2.5 right-3">€</p>
          </div>
        </div>
      </CardModalSection>
      <CardModalSection title="Niveau" class="pt-4">
        <div class="flex gap-8">
          <div v-for="level in levels" :key="`niveauTarif-${level.id}`">
            <Button
              @click="changeLevel(level.id)"
              :label="level.label"
              class="w-52"
              couleur="none"
              :class="{ 'bg-sky-600 text-white': levelChecked.includes(level.id) }"
            />
          </div>
        </div>
        <div class="text-sm mt-4">
          <p class="mb-4">Lorsque les conditions d’effet sont identiques entre des tarifs de niveau différents, ceux avec un niveau de priorité plus important sont pris en compte. (Niv 1 = priorité maximale)</p>
          <p>Niv 1 : Tournois, canicule, portes ouvertes</p>
          <p>Niv 2 : Vacances, jours fériés</p>
          <p>Niv 3 : Annuel, semestriel</p>
        </div>
      </CardModalSection>
      <CardModalSection title="Périodes et horaires" class="pt-4">
        <div class="border border-slate-300 p-6 rounded-lg">
          <p>Dates</p>
          <div class="flex items-center gap-20 my-4">
            <vue-tailwind-datepicker
              i18n="fr"
              as-single
              v-model="dateDebut"
              :formatter="{ date: 'DD / MM / YYYY', month: 'MMMM' }"
              class="w-full"
            />
            <p>à</p>
            <vue-tailwind-datepicker
              i18n="fr"
              as-single
              v-model="dateFin"
              :formatter="{ date: 'DD / MM / YYYY', month: 'MMMM' }"
              class="w-full"
            />
          </div>
          <p class="mt-8 mb-4">Jours</p>
          <div class="flex items-center gap-4">
            <div
              v-for="(day, key) in days"
              :key="`day-${key}`"
              :class="{ 'bg-blue-400 text-white': selected_days[key] == true }"
              class="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full border p-4 text-gray-700"
              @click="selectDay(key)"
            >
              {{ day }}
            </div>
          </div>
          <p class="mt-8 mb-4">Horaires</p>
          <div class="flex items-center">
            <FAInput
              v-model="heureDebut"
              class="w-1/12"
              placeholder="08"
              type="text"
            />
            <p class="mx-2">:</p>
            <FAInput
              v-model="minDebut"
              class="w-1/12"
              placeholder="00"
              type="text"
            />
            <p class="mx-6">à</p>
            <FAInput
              v-model="heureFin"
              class="w-1/12"
              placeholder="08"
              type="text"
            />
            <p class="mx-2">:</p>
            <FAInput
              v-model="minFin"
              class="w-1/12"
              placeholder="00"
              type="text"
            />
          </div>
        </div>
      </CardModalSection>
      <div class="pl-4">
        <MentionChampsObligatoires />
      </div>
    </Modal>
  </form>
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
import Modal from '@components/common/Modal.vue'
import ButtonRight from '@components/common/ButtonRight.vue'
import LabelText from '@components/common/LabelText.vue'
import InfoSVG from '@components/svg/InfoSVG.vue'
import FAInput from '@components/common/Input.vue'
import InputSelect from '@components/common/Select.vue'
import CardModalSection from '@components/common/CardModalSection.vue'

import { getTarifs, getTarif, patchTarif } from '@api/tarifs'
import { getActivites } from '../../api/activite.ts'

import 'vue3-toastify/dist/index.css'
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'

const props = defineProps(['id'])
const route = useRoute()
const tarifsByActivities = ref([])
const openModal = ref(false)
const tarif = ref({})
const days = 'LMMJVSD'
const activites = ref({})
const listDuree = ['60 min', '1h', '2h']
const levelChecked = ref([])
const selected_days = ref([])
const heureDebut = ref('')
const minDebut = ref('')
const heureFin = ref('')
const minFin = ref('')

const levels = ref([
  {
    id: 1,
    label: "Niv 1 : Tarif exceptionnel"
  },
  {
    id: 2,
    label: "Niv 2 : Tarif spécial"
  },
  {
    id: 3,
    label: "Niv 3 : Tarif général"
  }
])

const fetchDonnees = async () => {
  tarifsByActivities.value = await getTarifs(props.id)
  tarifsByActivities.value = tarifsByActivities.value.map(tarif => ({ ...tarif, open: false }))
  activites.value = await getActivites(props.id, 1, '&order=asc')
}

const getActivities = computed(() => {
  return activites.value.map((act) => {
    return {
      id: act.id,
      label: act.libelle,
    }
  })
})

const selectDay = (day_index: number) => {
  selected_days.value[day_index] = !selected_days.value[day_index]
  const data = []
  for (let i = 0; i < days.length; i++) {
    if (selected_days.value[i] === true) {
      data.push(i + 1)
    }
  }
}

const changeLevel = (idLevel: number) => {
  levelChecked.value = []
  levels.value.forEach(level => {
    if (level.id === idLevel) levelChecked.value.push(idLevel)
  })
}

onMounted(async () => {
  await fetchDonnees()
  // let sortableList
  // const items = document.querySelectorAll('.item')

  // items.forEach(item => {
  //   sortableList = document.querySelector('.item')?.closest('.sortable-list')
  //   item.addEventListener('dragstart', () => {
  //     item.classList.add("dragging")
  //   })
  //   item.addEventListener('dragend', async () => {
  //     item.classList.remove('dragging')
  //     // await patchTarif(route.params.id, item.id, { priorite: 2 })
  //   })
  // })

  // const initSortableList = (e: any) => {
  //   e.preventDefault()
  //   const draggingItem = sortableList?.querySelector('.dragging')
  //   const siblings = [...sortableList.querySelectorAll('.item:not(.dragging)')]

  //   let nextSibling = siblings.find(sibling => {
  //     return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
  //   })
    
  //   sortableList?.insertBefore(draggingItem, nextSibling)
  //   console.log(sortableList)
  // }

  // sortableList?.addEventListener('dragover', initSortableList)
  // sortableList?.addEventListener('dragenter', e => e.preventDefault())
})

watch(() => route.params.id, async() => await fetchDonnees())

const modifieTarif = async (i :number) => {
  console.log(`modifier actif / inactif du tarif ${i}`)
}

const editTarif = async (i :number) => {
  tarif.value = await getTarif(props.id, i)
  tarif.value.montant = Intl.NumberFormat('fr-FR').format(tarif.value.montant / 100)
  openModal.value = true
}

const addTarif = () => {
  openModal.value = true
}

const openTarif = (tarif :object) => {
  tarif.open = !tarif.open
}

const saveTarif = async () => {
  console.log('save tarif')
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
</style>
