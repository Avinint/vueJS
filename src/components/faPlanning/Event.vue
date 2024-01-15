<template>
  <div class="flex h-full items-center">
    <div
    class="h-full w-2 rounded-l-xl"
    :class="{
      'bg-red-600': event.extendedProps.type == 1,
      'bg-blue-600': event.extendedProps.type == 2,
    }"
    ></div>
    <div class="flex grow justify-between px-3 pr-3 text-xs text-black">
      <div class="flex flex-col">
        <span v-if="Object.entries(event.extendedProps).length !== 0">
           {{ dayjs(event.extendedProps.dateDebut).format('H:mm') }} -
          {{ dayjs(event.extendedProps.dateFinCreneau).format('H:mm') }}
        </span>
        <span v-else>
          {{ dayjs(event.start).format('H:mm') }} -
          {{ dayjs(event.end).format('H:mm') }}
        </span>
        <span>{{ event.extendedProps.organismeLabel }} : {{ event.title }}</span>
      </div>
      <div class="flex">
        <span
          v-if="event.extendedProps.activites"
          class="mr-2 fill-red-600"
        ></span>
        <!-- span
          class="text-2xs border-3 flex h-8 w-8 items-center justify-center rounded-full border-red-600 bg-white text-center leading-none"
        >
          Terrain<br />
          1/3
        </span-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { defineProps } from 'vue'

defineProps<{
  event: CalendarEvent
}>();
</script>
