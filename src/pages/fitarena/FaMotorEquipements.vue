<template>
  <FaEquipements :id="id" code-type="motorise" libelle-type="motorisé"></FaEquipements>
</template>

<script setup>
import FaEquipements from "@pages/fitarena/FaEquipements.vue";

const props = defineProps(['id'])

</script>
