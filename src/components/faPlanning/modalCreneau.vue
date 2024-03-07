<template>
  <form @submit.prevent="submitCreneau()">
    <Modal
      v-if="isOpen"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modalTitle"
      size="4xl"
      :delete_button="typeAction === 'edit'"
      @cancel="$emit('closeModalCreneau')"
      @delete="delete_creneau"
    >
      <template #topButtons>
        <Button v-if="typeAction === 'edit'" test='TcloseModal' @click="delete_creneau" couleur="danger" borderless class="mr-6" label="Supprimer le créneau" />
      </template>
      <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
        Veuillez sélectionner le type créneau.
      </label>
      <div class="py-3">
        <InputRadio
          v-model="creneauStore.creneauType"
          name="typeCreneau"
          :list="typeCreneauListe"
          required
        />
      </div>
      <div v-if="creneauType !== null" class="flex justify-between items-end">
        <FAInput
          v-model="creneauStore.titre"
          :inline="false"
          :required="false"
          label="Ajouter un titre à votre créneau"
          class="w-6/12"
          placeholder="Ajouter un titre à votre créneau"
          type="text"
        />
        <InputSelect
          v-if="['organisme', 'maintenance'].includes(creneauType)"
          v-model="creneauStore.organisme"
          :required="true"
          :label="creneauType === 'organisme' ? 'Organisme' : 'Prestataire'"
          class="w-2/12"
          :options="getOrganismesOptions"
        />
        <FAInput
          v-if="creneauType === 'organisme'"
          v-model="creneauStore.nbPersonnesAttendu"
          :inline="false"
          :required="true"
          label="Nb pers. attendues"
          class="w-2/12"
          type="text"
        />
      </div>
      <div v-if="creneauType !== null" class="flex w-full">
        <div>
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
            Date du créneau
          </label>
          <div class="text-xs mt-3 h-2 pb-1"></div>
          <vue-tailwind-datepicker
            v-model="datepicked"
            i18n="fr"
            as-single
            :formatter="{ date: datepickerFormat, month: 'MMMM' }"
            class="bg-gray-50 text-center h-10"
          />
        </div>
        <div class="ml-20 grow">
          <label class="required  block w-1/2 text-sm font-medium text-gray-900">
            Plage horaire du créneau
          </label>
          <div class="text-xs pb-1">Vous avez sélectionné {{ isNaN(nbCreneauxSelectionnes) ? 0 : nbCreneauxSelectionnes }}
            créneau{{ nbCreneauxSelectionnes > 1 ? 'x' : '' }}
          </div>
          <div class="flex">
            <select
              :value="creneauStore.heureDebut"
              @change="setHeureDebut"
              required
              class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option
                v-for="(creneauHoraire, i) in listStart"
                :key="i"
                :value="creneauHoraire"
              >
                {{ creneauHoraire }}
              </option>
            </select>
            <div class="px-4 py-2">à</div>
            <select
              :value="creneauStore.heureFin"
              @change="setHeureFin"
              required
              class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option
                v-for="(creneauHoraire, i) in listEnd"
                :key="i"
                :value="creneauHoraire"
              >
                {{ creneauHoraire }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <FAButton
        v-if="creneauType === 'grand_public'"
        class="mr-4"
        :class="submenu === 'advanced' ? 'bg-advanced' : 'bg-none'"
        label="Paramètres avancés"
        @click="setSubmenu('advanced')"
      />
      <FAButton
        v-if="creneauType && (creneauStore.recurrence != undefined || typeAction === 'create')"
        label="Récurrence"
        :class="submenu === 'recurence' ? 'bg-recurence' : 'bg-none'"
        @click="setSubmenu('recurence')"
      />
      <div v-if="submenu === 'advanced'" class="flex gap-5">
        <FAInput
          v-model="dureeActivite"
          :inline="false"
          :required="true"
          label="Durée d'un créneau"
          class="grow"
          placeholder="55"
          type="number"
        />
        <FAInput
          v-model="creneauStore.dureeInterCreneau"
          :inline="false"
          :required="true"
          label="Durée d'inter créneau"
          class="grow"
          placeholder="5"
          type="number"
        />
      </div>
      <MenuRecurrence v-if="submenu === 'recurence'" />
      <p class="font-bold text-red-600">{{ recurrenceErrorMessage }}</p>
      <div
        v-if="creneauType !== null"
        class="relative rounded-lg border border-gray-300 p-4"
      >
      <div class="flex items-center">
        <label class="block text-sm font-bold text-gray-900 mr-10">Zones</label>
        <!-- SÉLECTION DE TOUTES LES ZONES -->
        <input
          :id="zones"
          v-model="isAllZoneChecked"
          type="checkbox"
          class="hidden"
          @click="selectAllZones()"
        />
        <label
          class="mb-3 mr-9 inline-block w-1/12 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-6 py-3 text-center text-sm text-black drop-shadow-sm"
          :class="{ 'bg-sky-600 text-white': isAllZoneChecked }"
          :for="zones"
        >
          {{ labelCheckedAllZones }} toutes les zones
        </label>
      </div>
        <label
          v-if="creneauType !== 'organisme' && creneauStore.zones.length > 0"
          class="absolute top-32 my-4 block text-sm font-bold text-gray-900"
        >
          Activités
        </label>
        <div class="flex overflow-x-scroll py-3">
          <template v-if="!spinnerZones" v-for="zone in zones" :key="zone">
            <!-- v-if="isZoneEditable(zone)" -->
            <div class="w-80 flex-col">
              <input
                :id="zone.code"
                v-model="creneauStore.zones"
                type="checkbox"
                :value="zone.id"
                class="hidden"
                @click="selectZoneEtActivite(zone)"
              />
              <label
                class="mb-3 mr-9 inline-block w-3/4 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-6 py-3 text-center text-sm text-black drop-shadow-sm"
                :class="{ 'bg-sky-600 text-white': isZoneChecked(zone.id) }"
                :for="zone.code"
              >
                {{ zone.libelle }}
              </label>
              <div
                v-if="isZoneChecked(zone.id) && creneauType !== 'organisme'"
                class="flex-col pt-10"
              >
                <div
                  v-for="zoneActivite in zone.zoneActivites"
                  :key="zone.id + '-' + zoneActivite.activite.id"
                >
                  <div
                    v-if="zoneActivite.actif"
                    class="my-4 mr-10 flex justify-between"
                  >
                    <input
                      :id="zone.id + '-' + zoneActivite.activite.id"
                      v-model="zoneActivite.activite.checked"
                      @change="e => clicActivite(zone.id, zoneActivite.activite.id, e.target.checked)"
                      type="checkbox"
                      class="hidden"
                    />
                    <label
                      class="mr-4 inline-block w-3/4 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-4 py-3 text-center text-sm text-black drop-shadow-sm"
                      :class="{
                        'bg-sky-600 text-white': zoneActivite.activite.checked,
                      }"
                      :for="zone.id + '-' + zoneActivite.activite.id"
                    >{{ zoneActivite.activite.libelle }}
                    </label>
                    <div @click="zoneActivite.activite.checked ? openTarifModal(zone, zoneActivite) : null" :class="{'tarif-force': zoneActivite.tarifForce}" class="justify-center rounded-lg cursor-pointer w-40 p-2 border border-gray-200 relative flex items-center">
                      {{ zoneActivite.activite.tarif }}
                      <span class="absolute top-2 right-2">€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <p class="font-bold text-red-600">{{ activityErrorMessage }}</p>
      </div>
      <MentionChampsObligatoires/>
    </Modal>
  </form>

  <Modal
    v-if="verifModal"
    @cancel="verifModal = false"
    size="4xl"
    title="CONFIRMATION DE CRÉATION"
    type="none"
  >
    <CardModalSection
      v-if="verifCreneaux.creneauxValide.length > 0"
      title="CRÉNEAUX SOUMIS POUR VALIDATION PAR LA COLLECTIVITÉ"
      class="pl-4"
    >
      <table
        v-if="verifCreneaux.creneauxValide"
        class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200 table-fixed"
      >
        <thead>
        <tr>
          <th scope="col" class="px-6 py-3">Date du créneau</th>
          <th scope="col" class="px-6 py-3">Horaire</th>
          <th scope="col" class="px-6 py-3">Statut demande</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(
              creneau, i
            ) in verifCreneaux.creneauxValide"
          :key="`creneauxValide-`+ i"
          class="bg-white border border-gray-200"
        >
          <td class="px-6 py-4 flex">
            {{ $dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
          </td>
          <td class="px-6 py-4 border border-gray-200">
            {{ $dayjs(creneau.dateDebut).format('HH:mm') }} - {{ $dayjs(creneau.dateSortie).format('HH:mm') }}
          </td>
          <td class="px-6 py-4 flex items-center" id="statut">
            Soumis à validation
            <div class="w-3 h-3 bg-green-600 rounded-xl ml-10"/>
          </td>
        </tr>
        </tbody>
      </table>
    </CardModalSection>

    <CardModalSection
      v-if="verifCreneaux.creneauxConflit.length > 0"
      title="CRÉNEAUX NON CRÉÉS, CAR ILS ENTRENT EN CONFLIT AVEC DES RÉSERVATIONS DÉJÀ VALIDÉES"
      class="pl-4"
    >
      <table
        class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200 table-fixed"
      >
        <thead>
        <tr>
          <th scope="col" class="px-6 py-3">Date du créneau</th>
          <th scope="col" class="px-6 py-3">Horaire</th>
          <th scope="col" class="px-6 py-3">Statut demande</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(
              creneau, i
            ) in verifCreneaux.creneauxConflit"
          :key="`creneauxConflit-`+ i"
          class="bg-white border border-gray-200"
        >
          <td class="px-6 py-4 flex">
            {{ $dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
          </td>
          <td class="px-6 py-4 border border-gray-200">
            {{ $dayjs(creneau.dateDebut).format('HH:mm') }} - {{ $dayjs(creneau.dateSortie).format('HH:mm') }}
          </td>
          <td class="px-6 py-4 flex items-center" id="statut">
            Non validé
            <div class="w-3 h-3 bg-red-600 rounded-xl ml-10"/>
          </td>
        </tr>
        </tbody>
      </table>
    </CardModalSection>

    <CardModalSection
      v-if="verifCreneaux.creneauxDemandeConflit.length > 0"
      title="DEMANDES CRÉEES CAR LES CRÉNEAUX ENTRENT EN CONFLIT AVEC DES DEMANDES EN COURS"
      class="pl-4"
    >
      <table
        class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200 table-fixed"
      >
        <thead>
        <tr>
          <th scope="col" class="px-6 py-3">Date du créneau</th>
          <th scope="col" class="px-6 py-3">Horaire</th>
          <th scope="col" class="px-6 py-3">Statut demande</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(
              creneau, i
            ) in verifCreneaux.creneauxDemandeConflit"
          :key="`creneauxConflit-`+ i"
          class="bg-white border border-gray-200"
        >
          <td class="px-6 py-4 flex">
            {{ $dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
          </td>
          <td class="px-6 py-4 border border-gray-200">
            {{ $dayjs(creneau.dateDebut).format('HH:mm') }} - {{ $dayjs(creneau.dateSortie).format('HH:mm') }}
          </td>
          <td class="px-6 py-4 flex items-center" id="statut">
            En cours
            <div class="w-3 h-3 bg-green-600 rounded-xl ml-10"/>
          </td>
        </tr>
        </tbody>
      </table>
    </CardModalSection>
    <div class="flex justify-end gap-4">
      <Button
        @click="modifierDemande"
        label="Modifier ma demande"
        couleur="secondary"
        class="border border-red-600 text-red-600"
      />
      <Button
        v-if="isPossibleToCreateDemande"
        @click="submitDemandeValidation"
        label="Valider ma demande"
        couleur="danger"
      />
    </div>
  </Modal>
  <Modal
    v-if="tarifModal"
    @cancel="closeTarifModal()"
    size="2xl"
    title="SÉLECTION DE TARIF"
    type="none"
  >
    <CardModalSection
      :title="activiteLabel"
      class="pl-4"
    >
      <InputSelect
        v-model="tarifId"
        :required="true"
        label="Sélectionner un tarif"
        class="w-fit-content"
        :options="getTarifsOptions"
      />
      <p class="text-black text-xs my-2">Le tarif sélectionné sera appliqué sur tous les créneaux de la plage horaire que vous êtes en train de créer.</p>
    </CardModalSection>
    <div class="flex justify-end gap-4">
      <Button
        @click="closeTarifModal()"
        label="Annuler"
        couleur="secondary"
        class="border border-red-600 text-red-600"
      />
      <Button
        @click="submitTarif()"
        label="Valider mon tarif"
        couleur="danger"
      />
    </div>
  </Modal>
</template>

<script>
import { usePlanningStore } from '@stores/planning.ts'
import { useCreneauStore } from '@stores/creneau.ts'
import { useTypeCreneauStore } from '@stores/typeCreneau.js'
import { useOrganismeStore } from '@stores/organisme.ts'
import { makeDemandeAdminEditContract, makeDemandeAdminOGEditContract } from '../../services/planning/creneau_service'
import { getZones } from '@api/zone'
import { postCreneauVerifDemande } from '@api/creneau'
import { getTarif, getTarifByActivity, getTarifsByActivity } from '@api/tarifs'

import Modal from '@components/common/Modal.vue'
import ValidationModal from '@components/common/ValidationModal.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import InputRadio from '@components/common/InputRadio.vue'
import InputSelect from '@components/common/Select.vue'
import FAInput from '@components/common/Input.vue'
import FAButton from '@components/common/Button.vue'
import Button from '@components/common/Button.vue'
import MenuRecurrence from '@components/faPlanning/MenuRecurrence.vue'
import MentionChampsObligatoires from '@components/common/MentionChampsObligatoires.vue'

import { mapStores } from 'pinia'
import { toast } from 'vue3-toastify'

export default {
  components: {
    Modal,
    ValidationModal,
    CardModalSection,
    InputRadio,
    InputSelect,
    FAInput,
    FAButton,
    MenuRecurrence,
    MentionChampsObligatoires,
    Button
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    typeAction: {
      type: String,
      default: ''
    },
    readonly: Boolean,
    mode: String
  },
  emits: ['closeModalCreneau'],
  data () {
    return {
      zones: [],
      isAllZoneChecked: false,
      datepicked: '',
      datepickerFormat: 'DD / MM / YYYY',
      timeSeparator: ':',
      defaultTarif: '0',
      submenu: 'none',
      activityErrorMessage: '',
      recurrenceErrorMessage: '',
      verifModal: false,
      verifCreneaux: [],
      labelCheckedAllZones: 'Sélectionner',
      tarifModal: false,
      activiteLabel: '',
      activiteId: -1,
      tarifs: [],
      tarifId: -1,
      zoneActivite: { activite: {tarifId: null}},
      zoneId: -1,
      spinnerZones: false
    }
  },
  async mounted() {
    this.spinnerZones = true
    this.datepicked = this.$dayjs(this.creneauStore.date).format(
      this.datepickerFormat
    )
    await this.fetchZones()
    await this.organismeStore.fetchOrganismes({ 'fit_arena.id': this.$route.params.id })

    if (this.typeAction === 'create') {
      this.creneauStore.activites = []
    } else {
      if (this.creneauStore.recurrence) this.submenu = 'recurence'
    }
    this.spinnerZones = false
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
    ...mapStores(useTypeCreneauStore),
    ...mapStores(useOrganismeStore),
    isPossibleToCreateDemande () {
      // CACHER LE BOUTON "VALIDER MA DEMANDE" LORSQU'AUCUN CRÉNEAU NE PEUT ÊTRE CRÉÉ
      return !(this.verifCreneaux.creneauxValide.length === 0 && this.verifCreneaux.creneauxConflit.length && this.verifCreneaux.creneauxDemandeConflit.length === 0)
    },
    modalTitle() {
      switch (this.typeAction) {
        case 'create':
          return 'Création de créneau'
        case 'edit':
          return 'Modifier un créneau'
        default:
          return 'Modifier un créneau'
      }
    },
    typeCreneauListe() {
      return this.typeCreneauStore.typeCreneauListe
    },
    creneauType() {
      return this.typeCreneauListe.find(type => type.id === this.creneauStore.creneauType)?.code ?? null
    },
    getOrganismesOptions() {
      return this.organismeStore.organismes.map((organisme) => {
        return {
          id: organisme.id,
          label: organisme.libelle,
        }
      })
    },
    getTarifsOptions() {
      return [{ id: null, label: "Tarif auto" }, ...this.tarifs.map((tarif) => {
        return {
          id: tarif.tarifId,
          label: `${tarif.niveau}.${tarif.priorite} - ${tarif.libelle}`,
        }
      })]
    },
    dureeActivite: {
      get() {
        return this.creneauStore.dureeActivite
      },
      set(val) {
        if (val !== 0) {
          this.creneauStore.dureeActivite = val
        }
        if (isNaN(val)) {
          val = 0
        }
      }
    },
    heures: {
      get() {
        return [this.creneauStore.heureDebut, this.creneauStore.heureFin]
      },
      set(valeur) {
        this.creneauStore.heureDebut = valeur[0]
        this.creneauStore.heureFin = valeur[1]
      }
    },
    dureeInterCreneau() {
      return this.creneauStore.dureeInterCreneau
    },
    dureeCreneau() {
      return this.creneauStore.dureeActivite + this.creneauStore.dureeInterCreneau
    },
    dureePlage() {
      const [heureDebut, minutesDebut] = this.creneauStore.heureDebut.split(':')
      const [heureFin, minutesFin] = this.creneauStore.heureFin.split(':')

      return (heureFin - heureDebut) * 60 + parseInt(minutesFin) - minutesDebut
    },
    nbCreneauxSelectionnes() {
      return Math.round(this.dureePlage / this.dureeCreneau)
    },
    slotMinTimeNumber() {
      return Number(
        this.planningStore.slotMinTime
        .split(this.timeSeparator)[0]
      )
    },
    slotMaxTimeNumber() {
      return Number(
        this.planningStore.slotMaxTime
        .split(this.timeSeparator)[0]
        .replace('0', '')
      )
    },
    heureDebutMax() {
      return this.formatterHoraire(this.getHeureBrut(this.planningStore.slotMaxTime))
    },
    heureFinMax() {
      return this.formatterHoraire(this.getHeureBrut(this.planningStore.slotMaxTime))
    },
    listStart() {
      let list = []
      const [heureMax, minuteMax] = this.heureDebutMax.split(this.timeSeparator).map(v => parseInt(v))
      for (let i = this.slotMinTimeNumber; i <= heureMax ; i++) {
        let minuteMaxJournee =  i < heureMax ? 59 : minuteMax
        for (let y = 0; y <= minuteMaxJournee; y += 5) {
          const hours = i.toString().padStart(2, '0')
          const minutes = y.toString().padStart(2, '0')

          list.push(hours + this.timeSeparator + minutes)
        }
      }

      return list
    },
    listEnd() {
      let list = []
      if (this.creneauType === 'grand_public') {
        const [heureMax, minuteMax] = this.heureFinMax.split(this.timeSeparator).map(v => parseInt(v))
        let [heureMin, minuteMin] = this.creneauStore.heureDebut.split(this.timeSeparator).map(v => parseInt(v));
        const heureMinBrut = heureMin * 60 + minuteMin
        const heureMaxBrut = heureMax * 60 + minuteMax
        for (let m = heureMinBrut + this.dureeCreneau; m <= heureMaxBrut; m += this.dureeCreneau) {
          list.push(this.formatterHoraire(m).replace('24:', '00:'))
        }
      } else {
        list = this.listStart
      }
      return list
    },
    isOneZoneChecked() {
      return this.creneauStore.zones.length > 0
    },
    isOneActivityChecked() {
      return this.creneauStore.activites.length > 0
    },
    isNotOrganismeOrMaintenance() {
      return (
        this.creneauType !== 'organisme' &&
        this.creneauType !== 'maintenance'
      )
    }
  },
  watch: {
    datepicked(newDatepicked) {
      this.creneauStore.date = this.$dayjs(
        newDatepicked,
        this.datepickerFormat
      ).format('YYYY-MM-DD')
    },
    dureeCreneau() {
      this.changerHeureFinSelonDureeCreneau()
    }
  },
  methods: {
    async submitTarif () {
      this.spinnerZones = true
      let montant

      try{
        if (this.tarifId === null) {
          montant = await this.getTarifByActivite(zoneActivite.activite.id, this.creneauStore.date, this.creneauStore.heureDebut)
        } else {

          montant = (await getTarif(this.tarifId)).montant
          this.zones.forEach(zone => {
            if (zone.id === this.zoneId) {
              zone.zoneActivites.forEach(async zoneAct => {
                if (zoneAct.id === this.zoneActivite.id) {
                  zoneAct.activite.tarif = Intl.NumberFormat('fr-FR').format(montant / 100)
                  zoneAct.activite.tarifId = this.tarifId
                  zoneAct.tarifForce = true
                }
              })
            }
          })
        }

      } catch(e) {
        toast.error("Aucun tarif trouvé pour cette activité")
      } finally {
        this.tarifModal = false
        this.activiteLabel = ''
        this.activiteId = -1
        this.tarifId = -1
        this.spinnerZones = false
      }
    },
    async getTarifByActivite (idActivite, date, heure) {
      const data = await getTarifByActivity(this.$route.params.id, idActivite, date, `${heure}:00`)
      return Intl.NumberFormat('fr-FR').format(data.tarif.montant / 100)
    },
    async openTarifModal (zone, zoneActivite) {
      this.tarifs = await getTarifsByActivity(this.$route.params.id, zoneActivite.activite.id)
      this.tarifModal = true
      this.activiteLabel = zoneActivite.activite.libelle
      this.activiteId = zoneActivite.activite.id
      this.zoneActivite = zoneActivite
      this.zoneId = zone.id
    },
    closeTarifModal () {
      this.tarifModal = false
      this.activiteLabel = ''
      this.tarifId = -1
    },
    setHeureDebut(event) {
      this.creneauStore.heureDebut = event.target.value
      this.changerHeureFinSelonDureeCreneau()
    },
    changerHeureFinSelonDureeCreneau() {
      const nouvelleDureePlage = this.nbCreneauxSelectionnes * this.dureeCreneau
      this.creneauStore.heureFin = this.getHeureSelonDuree(this.creneauStore.heureDebut, nouvelleDureePlage)
    },
    setHeureFin(event) {
      this.creneauStore.heureFin = event.target.value
      // const nouvelleDureePlage = this.nbCreneauxSelectionnes * this.dureeCreneau
      // this.creneauStore.heureDebut = this.getHeureSelonDuree(this.creneauStore.heureFin, -nouvelleDureePlage)
    },
    getHeureSelonDuree(horaire, duree) {
      const nouvelHoraireBrut = this.getHeureBrut(horaire) + duree
      return this.formatterHoraire(nouvelHoraireBrut)
    },
    /**
     * Convertit un horaire affichable en nombre de minutes depuis le début de la journée
     * @param {string}  horaireFormate
     * @returns {number}
     */
    getHeureBrut(horaireFormate) {
      const [heures, minutes] = horaireFormate.split(this.timeSeparator)
      return (parseInt(heures) * 60) + parseInt(minutes)
    },
    /**
     * Convertit un nombre de minutes en horaire affichable
     * @param horaireBrut
     * @returns {string}
     */
    formatterHoraire(horaireBrut) {
      return Math.floor(horaireBrut / 60).toString().padStart(2, '0') + this.timeSeparator + (horaireBrut % 60).toString().padStart(2, '0')
    },
    /**
     * Open the submenu that contains additional inputs
     * @param {'advanced' | 'recurence' | 'none'} menu
     */
    setSubmenu(type) {
      if (this.submenu == type) {
        this.submenu = 'none';
        return;
      }

      this.submenu = type;
    },
    selectAllZones () {
      if (this.isAllZoneChecked) { // si toutes les zones sont déjà checkées
        this.labelCheckedAllZones = 'Sélectionner'
        // si créneau GP ==> désélectionner toutes les zones et activités
        if (this.creneauType === 'grand_public') {
          this.creneauStore.zones = []
          this.zones.forEach(zone => {
            zone.zoneActivites.forEach(activity => {
              activity.activite.checked = false
            })
          })
        }
        else if (this.creneauType === 'organisme') {
          // si créneau organisme ==> désélectionner toutes les zones
          this.creneauStore.zones = []
        }
      } else {
        this.labelCheckedAllZones = 'Désélectionner'
        // si créneau GP ==> sélectionner toutes les zones et activités
        if (this.creneauType === 'grand_public') {
          this.creneauStore.zones = []
          this.zones.forEach(zone => {
            this.creneauStore.zones.push(zone.id)
            zone.zoneActivites.forEach(activity => {
              activity.activite.checked = true
            })
          })
        }
        else if (this.creneauType === 'organisme') {
          // si créneau organisme ==> sélectionner toutes les zones
          this.creneauStore.zones = []
          this.zones.forEach(zone => {
            this.creneauStore.zones.push(zone.id)
          })
        }
      }
      this.isAllZoneChecked = !this.isAllZoneChecked
    },
    selectZoneEtActivite(zone) {
      if (!this.isZoneChecked(zone.id)) {
        this.creneauStore.zones.push(zone.id)
        for (const activity of zone.zoneActivites) {
          activity.activite.checked = true
        }
      } else {
        const i = this.creneauStore.zones.findIndex(el => el === zone.id)
        this.creneauStore.zones.splice(i, 1)
        for (const activity of zone.zoneActivites) {
          activity.activite.checked = false
        }
      }
    },
    async delete_creneau() {
      if (confirm('Souhaitez-vous vraiment supprimer le créneau ?')) {
        await this.creneauStore.delete(this.mode).then({}).catch(e => {
          if (e.status === 422 && e.statusText === 'Unprocessable Content') {
            toast.error('Le créneau ne peut pas être supprimé, car il est déjà réservé !')
          }
        })
        this.$emit('closeModalCreneau')
      }
    },
    // isZoneEditable(zone) {
    //   if (this.typeAction == 'create' || this.typeAction === 'edit') return true

    //   return this.creneauStore.zones.includes(zone.id)
    // },
    async fetchZones() {
      this.zones = (await getZones({
        page: 1,
        'order[ordre]': 'asc',
        'typeZone.code': 'zone',
        fitArena: this.$route.params.id
      })).filter(zone => zone.actif && zone.zoneActivites.length > 0)
      this.zones.forEach((zone, i) => {
        zone.zoneActivites.forEach(za => {
          if (!za.actif) {
            this.zones.splice(i, 1);
          }
        })
      });

      await this.dynamiseActivites()
    },
    updateActivites() {
      this.creneauStore.activites = []
      this.zones.forEach((zone) => {
        zone.zoneActivites.forEach((zone_activite) => {
          if (zone_activite.activite.checked === true) {
            this.creneauStore.addActivite({
              libelle: zone_activite.activite.libelle,
              activiteId: zone_activite.activite.id,
              tarifId: parseInt(zone_activite.activite.tarifId),
              zoneId: zone.id,
            })
          }
        })
      })
    },
    clicActivite(zoneId, activiteId, checked) {
      const zone = this.zones.find(z => z.id === zoneId)
      const zoneActivite = zone.zoneActivites.find(za => za.activite.id === activiteId)

      zoneActivite.activite.checked = checked
      if (checked) {
        zoneActivite.activite.tarif = null
      }

    },
    async dynamiseActivites() {
      if (this.typeAction === 'edit') {
        this.zones.forEach(async (zone) => {
          zone.zoneActivites.forEach(async (zoneActivite) => {
            this.creneauStore.activites.forEach(async (activite) => {
              if (activite.id === zoneActivite.activite.id) {
                zoneActivite.activite.checked = true
                zoneActivite.tarifForce = !!activite.tarif.tarifId
                if (zoneActivite.tarifForce) {
                  zoneActivite.activite.tarifId = activite.tarif.tarifId
                  zoneActivite.activite.tarif = Intl.NumberFormat('fr-FR').format(activite.tarif.montant / 100)
                } else {
                  zoneActivite.activite.tarif = await this.getTarifByActivite(zoneActivite.activite.id, this.creneauStore.date, this.creneauStore.heureDebut)
                }
              }
            })
          })
        })
      }
    },

    /**
     * Bouton valider ma demande de la modale "confirmation de création"
     * @returns {Promise<void>}
     */
    async submitDemandeValidation() {
      const fitarena_id = parseInt(this.$route.params.id);
      if (this.typeAction === 'create') {
        this.creneauStore.creneauType === 1 ? this.creneauStore.addCreneau(fitarena_id) : this.creneauStore.addCreneauOrganisme(fitarena_id)
      } else {
        this.creneauStore.creneauType === 1 ? this.creneauStore.editCreneau(fitarena_id) : this.creneauStore.editCreneauOrganisme(fitarena_id)
      }
      this.$emit('closeModalCreneau')
      this.verifModal = false
    },

    /** bouton confirmer de la modale formulaire créneau **/
    async submitCreneau() {
      this.recurrenceErrorMessage = ''
      this.activityErrorMessage = ''
      const type_creneau = this.creneauStore.creneauType

      if (this.creneauStore.recurrence) {
        if (this.creneauStore.recurrence.maxOccurrences == 0 && (this.creneauStore.recurrence.dateFin === "Invalid Date" || this.creneauStore.recurrence.dateFin === "")) {
          this.creneauStore.recurrence = undefined
        } else {
          this.creneauStore.recurrence.separation <= 1 ? this.creneauStore.recurrence.separation = 0 : this.creneauStore.recurrence.separation -= 1
          if (this.creneauStore.recurrence.recurrenceType === 2) {
            if (this.creneauStore.recurrence.recurrenceJoursSemaine.length === 0) {
              this.recurrenceErrorMessage = "Veuillez renseigner au moins un jour dans la semaine pour la récurrence."
              return
            }
          } else if (this.creneauStore.recurrence.recurrenceType === 1) {
            this.creneauStore.recurrence.recurrenceJoursSemaine = []
          }
        }

      }
      const fitarena_id = parseInt(this.$route.params.id)
      
      if (this.isOneZoneChecked) {
        switch (type_creneau) {
          case 1:
            // Retrieve activity data from the local references
            // Before sending it to the API. This has to be done
            // This way because of the unsynchronized data.

            this.updateActivites()

            if (!this.isOneActivityChecked) {
              this.activityErrorMessage = "Vous devez sélectionner au moins une activité pour créer le créneau."
              break
            } else {
              const contract = makeDemandeAdminEditContract(fitarena_id, this.creneauStore)
              this.verifCreneaux = await postCreneauVerifDemande(contract)
              this.verifModal = true
            }
            break
          case 2:
          case 3:
            this.creneauStore.nbPersonnesAttendu = parseInt(this.creneauStore.nbPersonnesAttendu)
            const contract = makeDemandeAdminOGEditContract(fitarena_id, this.creneauStore)
            this.verifCreneaux = await postCreneauVerifDemande(contract)
            this.verifModal = true
            break
        }
      } else {
        this.activityErrorMessage = "Vous devez sélectionner au moins une activité pour créer le créneau."
      }
    },
    isZoneChecked(zoneId) {
      return this.creneauStore.zones.includes(zoneId)
    },
    modifierDemande() {
      if (this.creneauStore.recurrence === undefined) {
        this.creneauStore.recurrence = {
          dateDebut: '',
          dateFin: '',
          maxOccurrences: 0,
          recurrenceType: 1,
          recurrenceJoursSemaine: [],
          recurrenceOrdinaux: [],
          recurrenceSemainesMois: [],
          separation: 0
        }
      } else {
        this.creneauStore.recurrence.separation += 1
      }
      
      this.verifModal = false
    }
  },
}
</script>

<style scoped>
option {
  text-align: center;
}

.max-w-4xl {
  max-width: 56rem;
}

.bg-advanced, .bg-recurence {
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}

.bg-none {
  background-color: #fff;
  color: #000;
}

.tarif-force {
  background-color: #FFD533;
}
</style>
