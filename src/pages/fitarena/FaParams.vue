<template>
    <CardReservationDuration />

    <Card>
      <h1>Accès à la fit arena</h1>
    </Card>

    <Card>
      <h1>Annulation d'une réservation</h1>
      <div class="relative overflow-x-auto my-4 text-black">
        <div class="bg-white flex">
          <div class="flex justify-start items-center w-1/12">
            <Button test="TeditSlot" borderless icon="edit" type="secondary" v-if="!editCancelBooking" @click="setCancelBooking" />
            <Button test="TeditSlot" borderless icon="cross" type="secondary" v-if="editCancelBooking" @click="setCancelBooking" />
          </div>
          <div class="flex items-center w-full space-x-2">
            <p class="py-4 w-4/12">Délai d'annulation d'une réservation avant le début de la séance</p>
            <input v-if="editCancelBooking" v-model="cancelSessionTime" type="number" min="0" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"/>
            <div v-if="!editCancelBooking">{{cancelSessionTime}} h</div>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <h1>Condition de visualisation des créneaux</h1>
      {{visualisation_creneaux}}
      <div class="flex items-center space-x-2">
        <Button icon="edit" type="secondary" borderless></Button>
        <div class="flex items-center">
          <div class="mr-2">
            Actif
          </div>
          <Switch/>
        </div>
        <div class="text-sm">
          Nombre de jours visibles pour la réservation de créneaux par les utilisateurs Grand Public
        </div>
        <Button label="Détails" type="secondary" />
      </div>
      <Button class="font-bold font-black" label="Ajouter une condition de visualisation des créneaux" icon="add" type="secondary"/>
      <Modal v-if="false">

      </Modal>
    </Card>

    <CardConditionReservationOfSlots />
    <CardKeyMomentDuration />

    <Card>
      <h1>Invitation à une réservation</h1>
    </Card>
</template>

<script setup>
  import Card from "../../components/common/Card.vue"
  import Button from "../../components/common/Button.vue"
  import Modal from "../../components/common/Modal.vue"
  import Switch from "../../components/common/Switch.vue"
  import Input from "../../components/common/Input.vue"
  import CardConditionReservationOfSlots from "../../components/molecules/CardConditionReservationOfSlots.vue"
  import CardKeyMomentDuration from "../../components/molecules/CardKeyMomentDuration.vue"
  import CardReservationDuration from "../../components/molecules/CardReservationDuration.vue"
  import {
    getParametreFitArena,
    patchParametreFitArena,
    postParametreFitArena
  } from "../../api/parametreFitArena.js";
  import {onMounted, ref} from "vue";
  import {useRoute} from "vue-router";
  import {getParametres, postParametres} from "../../api/parametres.js";

  const ID_VISU_CRENEAU = 16

  const route = useRoute()

  const parametres = ref([])

  const visualisation_creneaux = ref({})

  const editCancelBooking = ref(false)

  const cancelSessionTime = ref(1)

  onMounted(async () => {
    // SEARCH ALL PARAMS FOR THIS FIT ARENA
    parametres.value = await getParametreFitArena(1, '?fitArena.id='+route.params.id)

    // PARAMETRE ANNULATION DES CRENEAUX
    cancelSessionTime.value = await getParameterByCode('condition-annulation-des-creneaux').valeur
  })

  const getParameterByCode = async (code, value = 0) => {
    let parametre = parametres.value.find(el => el.parametre.code === code)
    if (!parametre) {
      await createParamsForFitArena(route.params.id, code, value)
    }
    parametres.value = await getParametreFitArena(1, '?fitArena.id='+route.params.id)
    return parametres.value.find(el => el.parametre.code === code)
  }

  const createParamsForFitArena = async (id_fa, code, value) => {
    // CREATE GENERIC PARAMS
    const {id} = await postParametres({
      code,
      libelle: code,
      type: code,
      zoneParametres: []
    })
    // LINK PARAMS TO THIS FIT ARENA AND SET VALUE
    await postParametreFitArena({
      fitArena: "api/fit_arenas/"+id_fa,
      parametre: "api/parametres/"+id,
      valeur: ""+value
    })
  }

  const setCancelBooking = async () => {
    editCancelBooking.value = !editCancelBooking.value
    if (!editCancelBooking.value) { // RETURN TO READONLY MODE -> SAVE INPUT VIA API
      const {id} = (await getParametres(1, '&code=condition-annulation-des-creneaux'))[0]
      await patchParametreFitArena(id, {
        fitArena: "api/fit_arenas/"+route.params.id,
        parametre: "api/parametres/"+id,
        valeur: ""+cancelSessionTime.value
      })
    }
  }
</script>
