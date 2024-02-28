<template>
  <template v-if="tarifsParNiveau">
    <div v-for="(tarifs, index) in tarifsParNiveau" :key="`tarifs-${index}`">
      <h3 class="font-bold text-sm mb-2">Niveau {{ tarifs.niveau }} : Tarif {{ tarifs.type }}</h3>
      <table class="w-full text-left mb-10 rounded-lg">
        <thead class="bg-gray-200 text-sm">
        <tr>
          <th style="width:2%;">Prio</th>
          <th style="width:9%;">Statut</th>
          <th style="width:20%;">Nom du tarif</th>
          <th style="width:16%;">Tarif</th>
          <th style="width:15%;">Périodes</th> <!-- date début - date fin -->

          <th style="width:15%;" />  <!-- jours -->
          <th style="width:14%;" /><!-- plage horaire -->
          <th style="width:3%;" /> <!-- accordéon pour détails périodes -->
          <th style="width:3%;" /> <!-- modification (ouverture modal) -->
          <th style="width:3%;" /> <!-- bouton drag and drop (toute la row sera sélectionnable) -->
        </tr>
        </thead>

        <draggable v-model="tarifs.tarifs" item-key="idTarif" tag="tbody" @end="setOrdre(tarifs.tarifs)"
                    handle=".manette">
          <template #item="{ element: tarif }">
            <tr>
              <td colspan="10" class="padding-none">
                <table class="w-full">
                  <tr class="item" :id="tarif.idTarif">
                    <td style="width:2%;" class="text-center align-baseline">{{ tarif.priorite }}</td>
                    <td style="width:9%;" class="align-baseline">
                      <div class="flex gap-4">
                        <p class="statut-tarif">{{ tarif.actif ? 'Actif' : 'Inactif' }}</p>
                        <label class="relative inline-flex cursor-pointer items-center">
                          <input
                            v-model="tarif.actif"
                            type="checkbox"
                            value="true"
                            class="peer sr-only"
                            @change="$emit('changeStatut', tarif.idTarif, tarif.actif)"
                          />
                          <div
                            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                          ></div>
                          <span
                            class="ml-3 text-sm font-medium text-gray-900"
                          ></span>
                        </label>
                      </div>

                    </td>
                    <td style="width:20%" class="align-baseline">{{ tarif.nom }}</td>
                    <td style="width:16%;">{{ Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(tarif.tarif / 100) }} /
                      {{ tarif.duree }} min
                    </td>
                    <td style="width:15%;">{{ tarif.periodes.length }} période(s)</td>

                    <td style="width:15%;"/>
                    <td style="width: 4%;"/>
                    <td style="width:10%;"/>
                    <td style="width:3%;" class="text-center align-baseline">
                      <div class="px-3">
                        <InfoSVG :open="tarif.open" @click="openTarif(tarif)" class="cursor-pointer"/>
                      </div>
                    </td>
                    <td style="width:3%;" class="align-baseline">
                      <Button
                        icon="edit"
                        borderless
                        couleur="secondary"
                        @click="$emit('edit', tarif.idTarif)"
                      />
                      <div class="w-10"/>
                    </td>
                    <td style="width:3%;" class="manette align-baseline" title="manette du drag and drop">
                      <div class="border-t border-b border-black h-3 w-4 px-2"/>
                    </td>
                  </tr>
                  <template v-if="tarif.open">
                    <template v-for="(periode, i) in tarif.periodes" :key="`periode-${i}`">
                      <tr>
                        <td colspan="4" />
                        <td colspan="1">{{ dayjs(periode.dateDebut).format('DD/MM/YY') }} - {{ dayjs(periode.dateFin).format('DD/MM/YY') }}</td>
                        <td colspan="2">{{ periode.jours.join(' - ') }}</td>
                        <td colspan="1">{{ dayjs(periode.plageHoraireDebut).format('HH:mm') }} à {{ dayjs(periode.plageHoraireFin).format('HH:mm') }}</td>
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

<script setup lang="ts">

import dayjs from "dayjs";
import InfoSVG from "@components/svg/InfoSVG.vue";
import Input from "@components/common/Input.vue";
import Button from "@components/common/Button.vue";
import draggable from "vuedraggable";
import {sortTarifs} from "@api/tarifs";
import {toast} from "vue3-toastify";

const props = defineProps<{id: number, tarifsParNiveau: object[]}>()
const emit = defineEmits<{
  (e: "changeOrdre")
  (e: "edit", id: int): void,
  (e: "changeStatut", id: int, actif: boolean): void
  ;}>()

const setOrdre = async (liste: {idTarif, priorite}[]) => {

  await sortTarifs(props.id, liste)
    .catch(() => {
      toast.error("La liste des tarifs n'a pas pu être mise à jour.")
    })
  await emit("changeOrdre")
};

const openTarif = (tarif: object) => {
  tarif.open = !tarif.open
}
</script>

<style scoped lang="scss">
th, td {
  padding: 10px;
  color: #000000;
}

td.padding-none {
  padding: 0;
}

th {
  font-weight: 700;
}

tr {
  border-bottom: 1px solid rgb(229 231 235);
  border-right: 1px solid rgb(229 231 235);
  border-left: 1px solid rgb(229 231 235);
}


</style>