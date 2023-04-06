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
            <Button test="TeditSlot" borderless icon="edit" type="secondary" class="pl-0" @click="editCancelBooking" />
          </div>
          <div class="flex items-center w-full">
            <p class="py-4 w-4/12">Délai d'annulation d'une réservation avant le début de la séance</p>
            <Input v-model="cancelSessionTime" :type="'number'"></Input>h
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
  import {getParametreFitArenaById, postParametreFitArena} from "../../api/parametreFitArena.js";
  import {onMounted, ref} from "vue";
  import {useRoute} from "vue-router";
  import {getParametres, postParametres} from "../../api/parametre.js";

  const ID_VISU_CRENEAU = 16

  const route = useRoute()

  const visualisation_creneaux = ref({})

  const modalCancelBooking = ref(false)

  const cancelSessionTime = ref(1)

  onMounted(async () => {
    visualisation_creneaux.value = await getParametres(1, '&code=condition-de-visualisation-des-creneaux')
    if (!visualisation_creneaux.value.length) {
      await postParametres({
        fitarena: "api/fitarena/"+route.params.id,
        parametre: "api/parametre/"+ID_VISU_CRENEAU,
        valeur: "10"
      })
    }
  })

  const addVisuCreneaux = () => {

  }

  const editCancelBooking = () => {
    modalCancelBooking.value = true
  }
</script>
