<template>
    <!-- <CardReservationDuration /> -->

    <Card>
      <h1>Accès à la fit arena</h1>
    </Card>

    <Card>
      <h1>Annulation d'une réservation</h1>
    </Card>

    <Card>
      <h1>Condition de visualisation des créneaux</h1>
    </Card>

    <!-- <CardConditionReservationOfSlots /> -->
    <CardKeyMomentDuration />

    <Card>
      <h1>Invitation à une réservation</h1>
    </Card>
</template>

<script setup>
import Card from "../../components/common/Card.vue"
import CardConditionReservationOfSlots from "../../components/molecules/CardConditionReservationOfSlots.vue"
import CardKeyMomentDuration from "../../components/molecules/CardKeyMomentDuration.vue"
import CardReservationDuration from "../../components/molecules/CardReservationDuration.vue"

import "vue3-toastify/dist/index.css"
</script>
