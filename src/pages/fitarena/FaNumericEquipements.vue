<template>
  <FaEquipements :fitArenaId="fitArenaId" code-type="numerique" libelle-type="numérique"></FaEquipements>
</template>

<script setup>
import FaEquipements from "@pages/fitarena/FaEquipements.vue";
import { useRoute } from "vue-router";

const props = defineProps(['id'])
const fitArenaId = useRoute().params.id

</script>
