<template>
  <Card>
    <div class="mb-6 flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <h1 class="uppercase">MES {{ plural }}</h1>
        <Input placeholder="Recherche"/>
        <Button label="Filtrer" couleur="secondary"/>
      </div>
      <Button
        v-if="canCreate"
        id="TaddOrganisme"
        label="Ajouter un Organisme"
        icon="add"
        couleur="secondary"
        @click="emits('entity:new')"
      />
    </div>
    <BorderContainer>
      <LabelText :text="plural" />
      <Table
        :columns="columns"
        :data="data"
        selectable
        editable
        removable
        @entity:edit="entity_edit"
        @entity:remove="entity_remove"
      />
    </BorderContainer>
  </Card>
</template>

<script setup lang="ts">
import BorderContainer from '@components/common/BorderContainer.vue'
import Button from '@components/common/Button.vue';
import Card from '@components/common/Card.vue'
import Input from '@components/common/Input.vue';
import LabelText from '@components/common/LabelText.vue'
import Table, { type FaTableColumnData, type FaTableRow } from '@components/common/Table.vue'

defineProps<{
  entity: string;
  plural: string;
  columns: FaTableColumnData<any>[];
  data: FaTableRow<any>[];
  canCreate?: boolean;
}>()

function entity_edit(entity: unknown) {
  emits('entity:edit', entity)
}

function entity_remove(entity: unknown) {
  emits('entity:remove', entity)
}

const emits = defineEmits<{
  <T>(e: 'entity:new'): void
  <T>(e: 'entity:edit', entity: T): void
  <T>(e: 'entity:remove', entity: T): void
}>()
</script>

<style scoped></style>
