<template>
  <div class="flex h-full items-center">
    <div
    class="h-full w-2 "
    :class="event.extendedProps.statut ? 'bg-blue-600 rounded-l-xl' : ''"
    ></div>
    <!-- STATUT DEMANDE VALIDÉE -->
    <div v-if="event.extendedProps.statut == 'valide'" class="flex grow justify-between px-3 pr-3 text-xs text-black">
      <div class="flex flex-col">
        <span v-if="Object.entries(event.extendedProps).length !== 0">
          {{ dayjs(event.extendedProps.dateDebut).format('H:mm') }} -
          {{ dayjs(event.extendedProps.dateSortie).format('H:mm') }}
        </span>
        <span v-else>
          {{ dayjs(event.start).format('H:mm') }} -
          {{ dayjs(event.end).format('H:mm') }}
        </span>
        <span class="">{{ event.title }}</span>
      </div>
      <div class="flex">
        <span
          v-if="event.extendedProps.activites"
          class="mr-2 fill-red-600"
        ></span>
      </div>
    </div>
    <!-- STATUT DEMANDE EN COURS -->
    <div v-else-if="event.extendedProps.statut == 'demande'" class="flex grow justify-between px-3 pr-3 text-xs text-black">
      <div class="flex flex-col">
        <span v-if="Object.entries(event.extendedProps).length !== 0">
          {{ dayjs(event.extendedProps.dateDebut).format('H:mm') }} -
          {{ dayjs(event.extendedProps.dateSortie).format('H:mm') }}
        </span>
        <span v-else>
          {{ dayjs(event.start).format('H:mm') }} -
          {{ dayjs(event.end).format('H:mm') }}
        </span>
        <span class="">{{ event.title }}</span>
      </div>
      <div class="flex">
        <span
          class="mr-2 fill-red-600"
        ><img src="/src/assets/wait.svg" /></span>
      </div>
    </div>
    <!-- CRÉNEAU ANONYME -->
    <div v-else class="flex grow justify-between px-3 pr-3 text-xs text-black">
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{
  event: CalendarEvent
}>();
</script>

<style>

</style>