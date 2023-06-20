<template>
  <table class="w-full text-left">
    <colgroup>
      <col style="width: 60px" />
      <col v-for="_ in columns" />
      <col style="width: 75px" />
      <col style="width: 75px" />
    </colgroup>
    <thead class="h-10 text-sm w-full bg-gray-50 text-gray-700">
      <th></th>
      <th v-for="column in columns" :key="column.label">
        {{ column.label }}
      </th>
      <th></th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="item in data" class="h-10 border-x border-b border-gray-50 text-sm text-gray-700">
        <td class="h-10 flex justify-center items-center"><input type="checkbox"/></td>
        <td v-for="column in columns">{{ column.data(item) }}</td>
        <td>
          <Button
            test="TdeleteClient"
            borderless
            icon="edit"
            couleur="secondary"
            @click="emits('entity:edit', item)"
          />
        </td>
        <td>
          <Button
            test="TdeleteClient"
            borderless
            icon="delete"
            couleur="secondary"
            @click="emits('entity:remove', item)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Button from './Button.vue'

interface FaTableColumnCallback {
  (item: object): string
}

export type FaTableColumnData = {
  label: string;
  data: FaTableColumnCallback;
}

defineProps<{
  columns: FaTableColumnData[]
  data: any[]
  selectable?: boolean
  editable?: boolean
  removable?: boolean
}>()

const emits = defineEmits<{
  <T>(e: 'entity:edit', entity: T): void
  <T>(e: 'entity:remove', entity: T): void
}>()
</script>
