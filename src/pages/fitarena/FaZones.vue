<template>
  <Card>
    <h1>Zones</h1>
    <span class="font-bold text-sm">Zones d'activité: ensemble de sous-zones délimité physiquement sur lequel est praticable une seule activité en même temps.</span>
    <Button label="Ajouter une zone" type="secondary" icon="add" />
  </Card>

  <Modal v-if="false" title="Ajout d'une zone">
    <Card>
      <span>Ajout d'équipements numériques</span>
    </Card>
  </Modal>


</template>

<script setup>
import Card from "../../components/common/Card.vue"
import Button from "../../components/common/Button.vue"
import Modal from "../../components/common/Modal.vue"
</script>
