<template>
  <table class="w-full text-left">
    <colgroup>
      <col :style="{width: selectable ? '60px' : '20px'}" />
      <col v-for="_ in columns" />
      <col v-if="editable" style="width: 75px" />
      <col v-if="removable" style="width: 75px" />
    </colgroup>
    <thead class="h-10 text-sm w-full bg-gray-50 text-gray-700">
      <th></th>
      <th v-for="column in columns" :key="column.label">
        {{ column.label }}
      </th>
      <th v-if="editable"></th>
      <th v-if="removable"></th>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" class="h-10 border-x border-b border-gray-50 text-sm text-gray-700">
        <td class="h-10 flex justify-center items-center">
          <input v-if="selectable" type="checkbox"/>
        </td>
        <template v-for="(column, key) in columns">
          <td v-if="column.data">{{ column.data(item.data) }}</td>
          <td v-else>
            <slot :name="`col-${key}`" :item="item.data" :index="index"/>
          </td>
        </template>
        <td v-if="editable && item.editable">
          <Button
            test="TdeleteClient"
            borderless
            icon="edit"
            couleur="secondary"
            @click="emits('entity:edit', item.data)"
          />
        </td>
        <td v-if="removable && item.removable">
          <Button
            test="TdeleteClient"
            borderless
            icon="delete"
            couleur="secondary"
            @click="emits('entity:remove', item.data)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Button from './Button.vue'

interface FaTableColumnCallback<T> {
  (item: T): string
}

export type FaTableColumnData<T> = {
  label: string;
  data?: FaTableColumnCallback<T>;
}

export type FaTableRow<T> = {
  editable: boolean;
  removable: boolean;
  data: T;
}

defineProps<{
  columns: FaTableColumnData<any>[]
  data: FaTableRow<any>[]
  selectable?: boolean
  editable?: boolean
  removable?: boolean
}>()

const emits = defineEmits<{
  (e: 'entity:edit', entity: any): void
  (e: 'entity:remove', entity: any): void
}>()
</script>
