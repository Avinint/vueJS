<template>
  <FaEquipements :fitArenaId="fitArenaId" code-type="motorise" libelle-type="motorisé"></FaEquipements>
</template>

<script setup>
import FaEquipements from "@pages/fitarena/FaEquipements.vue";
import { useRoute } from "vue-router";

const props = defineProps(['id'])
const fitArenaId = useRoute().params.id

</script>
