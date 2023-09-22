<template>
  <FaEquipements :id="id" code-type="numerique" libelle-type="numérique"></FaEquipements>
</template>

<script setup>
import FaEquipements from "@pages/fitarena/FaEquipements.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const props = defineProps(['id'])

</script>
