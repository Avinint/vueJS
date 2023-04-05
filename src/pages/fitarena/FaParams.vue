<template>
    <CardReservationDuration />

    <Card>
      <h1>Accès à la fit arena</h1>
    </Card>

    <Card>
      <h1>Annulation d'une réservation</h1>
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
</script>
