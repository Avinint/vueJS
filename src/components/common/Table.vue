<template>
  <table class="w-full text-left">
    <colgroup>
      <col :style="{ width: selectable ? '60px' : '20px' }" />
      <col v-for="_ in columns" />
      <col v-if="editable" style="width: 75px" />
      <col v-if="removable" style="width: 75px" />
    </colgroup>
    <thead class="h-10 w-full bg-gray-50 text-sm text-gray-700">
      <th></th>
      <th v-for="column in columns" :key="column.label">
        {{ column.label }}
      </th>
      <th v-if="editable"></th>
      <th v-if="removable"></th>
    </thead>
    <tbody>
      <tr
        v-if="data.length > 0"
        v-for="(item, index) in data"
        class="h-10 border-x border-b border-gray-50 text-sm text-gray-700"
      >
        <td class="flex h-10 items-center justify-center">
          <input
            v-if="selectable"
            type="checkbox"
            class="table-checkbox"
            @click="updateSelected($event, item)"
          />
        </td>
        <template v-for="(column, key) in columns">
          <td v-if="column.data">{{ column.data(item.data) }}</td>
          <td v-else>
            <slot :name="`col-${key}`" :item="item.data" :index="index" />
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
      <tr class="nodata" v-else>
        <p>Aucune donnée</p>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'

interface FaTableColumnCallback<T> {
  (item: T): string
}

export type FaTableColumnData<T> = {
  label: string
  data?: FaTableColumnCallback<T>
}

export type FaTableRow<T> = {
  id: number
  editable: boolean
  removable: boolean
  data: T
}

const props = defineProps<{
  columns: FaTableColumnData<any>[]
  data: FaTableRow<any>[]
  selected?: FaTableRow<any>[]
  selectable?: boolean
  editable?: boolean
  removable?: boolean
}>()

const emits = defineEmits<{
  (e: 'entity:edit', entity: any): void
  (e: 'entity:remove', entity: any): void
  (e: 'update:selected', selected: FaTableRow<any>[]): void
}>()

const selected = ref<FaTableRow<any>[]>(props.selected ?? [])

function updateSelected(e: Event, item: FaTableRow<any>) {
  const value = (e.target as HTMLInputElement).checked
  if (value) {
    selected.value.push(item)
  } else {
    for (let i = 0; i < selected.value.length; i++) {
      const element = selected.value[i]
      if (element.id === item.id) {
        selected.value.splice(i, 1)
      }
    }
  }
  emits('update:selected', selected.value)
}
</script>

<style scoped>
.nodata {
  height: 1.5rem;
}

.nodata p {
  position: absolute;
  left: 50%;
}

.table-checkbox {
  background-color: rgb(230 230 230 / var(--tw-bg-opacity));
}

.table-checkbox:focus {
  box-shadow: none;
}

.table-checkbox:checked {
  background-color: rgb(147 197 253 / var(--tw-text-opacity));
}
</style>
