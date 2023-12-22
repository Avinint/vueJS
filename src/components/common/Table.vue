<template>
  <table :class="{'w-full' : fullWidth}" class="w-full text-left mt-4">
    <colgroup>
      <col :style="{ width: selectable ? '60px' : '20px' }" />
      <col v-for="_ in columns" />
      <col v-if="editable" style="width: 75px" />
      <col v-if="readable" style="width: 75px"/>
      <col v-if="removable" style="width: 75px" />
    </colgroup>
    <thead class="h-10 w-full bg-gray-100 text-sm text-gray-700">
    <tr>
      <th></th>
      <th :class="{ 'text-center': textCenter }" v-for="column in columns" :key="column.label">
        {{ column.label }}
      </th>
      <th v-if="editable"></th>
      <th v-if="readable"></th>
      <th v-if="removable"></th>
    </tr>
    </thead>
    <tbody>
      <template v-if="data.length > 0">
        <tr
          v-for="(item, index) in data"
          :key="item.data.id"
          class="h-10 border border-gray-200 text-sm text-gray-700"
          :class="{ 'text-center': textCenter }">
          {{ item.data.length }}
          <td class="flex h-10 items-center justify-center">
            <input
              v-if="selectable"
              type="checkbox"
              class="table-checkbox"
              @click="updateSelected($event, item)"
            />
          </td>
          <template v-for="(column, key) in columns" :key="`column-${key}`">
            <td v-if="column.data">{{ column.data(item.data) }}</td>
            <td v-else>
              <slot :name="`col-${key}`" :item="item.data" :index="index" />
            </td>
          </template>
          <td>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="5" :fill="item.data.statut.includes('acceptée') ? '#36A300' : '#D00000' " />
            </svg>
          </td>
          <td v-if="editable && item.editable">
            <Button
              test="TeditElement"
              borderless
              icon="edit"
              couleur="secondary"
              @click="emits('entity:edit', item.data)"
            />
          </td>
          <td v-if="readable && item.readable">
            <Button
              test="TreadElement"
              label="Détails"
              class="border border-gray-300"
              couleur="secondary"
              @click="emits('entity:read', item.data)"
            />
          </td>
          <td v-if="removable && item.removable">
            <Button
              test="TdeleteElement"
              borderless
              icon="delete"
              couleur="secondary"
              @click="emits('entity:remove', item.data)"
            />
          </td>
        </tr>
      </template>
      <tr class="nodata" v-else>
        <p class="text-sm">Aucune donnée.</p>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps, defineEmits } from 'vue'
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

interface Props {
  columns: FaTableColumnData<any>[]
  data: FaTableRow<any>[]
  selected?: FaTableRow<any>[]
  selectable?: boolean
  editable?: boolean
  removable?: boolean
  readable?: boolean
  textCenter?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  editable: false,
  removable: false,
  readable: false,
  textCenter: false,
  fullWidth: true
})

const emits = defineEmits<{
  (e: 'entity:edit', entity: any): void
  (e: 'entity:read', entity: any): void
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
  height: 3rem;
  position: relative;
}

.nodata p {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
