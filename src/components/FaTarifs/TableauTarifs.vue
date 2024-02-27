<script setup lang="ts">

import dayjs from "dayjs";
import InfoSVG from "@components/svg/InfoSVG.vue";
import Input from "@components/common/Input.vue";
import Button from "@components/common/Button.vue";
import draggable from "vuedraggable";
import {sortTarifs} from "@api/tarifs";
import {toast} from "vue3-toastify";

const props = defineProps<{id: number, tarifsParNiveau: object[]}>()

const setOrdre = async (liste: {idTarif, priorite}[]) => {
  await sortTarifs(props.id, liste)
    .catch(() => {
      toast.error("La liste des tarifs n'a pas pu être mise à jour.")
    })
};

const openTarif = (tarif: object) => {
  tarif.open = !tarif.open
}
</script>

<template>
<!--  activite.general-->
  <template v-if="tarifsParNiveau">
    <div v-for="(tarifs, i) in tarifsParNiveau" :key="`tarifs-${i}`">
      <h3 class="font-bold text-sm mb-2">{{ tarifs.niveau }} : Tarif {{ tarifs.type }}</h3>
      <table class="w-full text-left mb-10 rounded-lg">
        <thead class="bg-gray-200 text-sm">
        <tr>
          <th style="width:1%;">Prio</th>
          <th style="width:10%;">Statut</th>
          <th style="width:20%;">Nom du tarif</th>
          <th style="width:16%;">Tarif</th>
          <th style="width:15%;">Périodes</th> <!-- date début - date fin -->
          <th style="width:15%;" />  <!-- jours -->
          <th style="width:25%;" /><!-- plage horaire -->
          <th style="width:1%;" /> <!-- accordéon pour détails périodes -->
          <th style="width:1%;" /> <!-- modification (ouverture modal) -->
          <th style="width:1%;" /> <!-- bouton drag and drop (toute la row sera sélectionnable) -->
        </tr>
        </thead>

        <draggable v-model="tarifs.tarifs" item-key="idTarif" tag="tbody" @end="setOrdre(tarifs.tarifs)"
                   :component-data="{class:'sortable-list borderless'}" handle=".manette">
          <template #item="{ element: tarif }">
            <tr>
              <td colspan="10">
                <table>
                  <tr class="item" :id="tarif.idTarif">
                    <td style="width:1%;" class="text-center">{{ tarif.priorite }}</td>
                    <td style="width:10%;" class="flex gap-6 mt-3">
                      <p class="statut-tarif">{{ tarif.actif ? 'Actif' : 'Inactif' }}</p>
                      <label class="relative inline-flex cursor-pointer items-center">
                        <input
                          v-model="tarif.actif"
                          type="checkbox"
                          value="true"
                          class="peer sr-only"
                          @change="modifieTarif(tarif.idTarif, tarif.actif)"
                        />
                        <div
                          class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                        ></div>
                        <span
                          class="ml-3 text-sm font-medium text-gray-900"
                        ></span>
                      </label>
                    </td>
                    <td style="width:20%">{{ tarif.nom }}</td>
                    <td style="width:16%;">{{ Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(tarif.tarif / 100) }} /
                      {{ tarif.duree }} min
                    </td>
                    <td style="width:15%;">{{ tarif.periodes.length }} période(s)</td>
                    <td style="width:15%;"/>
                    <td style="width:10%;"/>
                    <td style="width:15%;"/>
                    <td style="width:1%;" class="text-center">
                      <div class="px-3">
                        <InfoSVG :open="tarif.open" @click="openTarif(tarif)" class="cursor-pointer"/>
                      </div>
                    </td>
                    <td style="width:1%;">
                      <Button
                        v-if="tarifs.niveau !== 4"
                        icon="edit"
                        borderless
                        couleur="secondary"
                        @click="editTarif(tarif.idTarif)"
                      />
                      <div class="w-10"/>
                    </td>
                    <td class="manette" style="width:1%;" title="manette du drag and drop">
                      <div class="border-t border-b border-black h-2 w-4 px-2"/>
                    </td>

                  </tr>
                  <template v-if="tarif.open">
                    <template v-for="(periode, i) in tarif.periodes" :key="`periode-${i}`">
                      <tr>
                        <td colspan="4" />
                        <td colspan="1">{{ dayjs(periode.dateDebut).format('DD/MM/YY') }} - {{ dayjs(periode.dateFin).format('DD/MM/YY') }}</td>
                        <td colspan="2">{{ periode.jours.join(' - ') }}</td>
                        <td>{{ dayjs(periode.plageHoraireDebut).format('HH:mm') }} à {{ dayjs(periode.plageHoraireFin).format('HH:mm') }}</td>
                        <td colspan="3" />
                      </tr>
                    </template>
                  </template>
                </table>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>
  </template>
</template>

<style scoped lang="scss">
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
</style>