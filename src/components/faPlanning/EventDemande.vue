<template>
  <div :id="`event-demande-${event.id}`">
    <div class="event-demande-wrapper">
      <div class="event-demande-content">
        <p class="information">Demande en attente</p>
        <p class="title">{{ event.title }}</p>
        <p class="hour">{{ start + ' - ' + end }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, defineProps } from 'vue'
import dayjs from "dayjs";

const props = defineProps<{
  event: CalendarEvent
}>()

const start = computed(() => dayjs(props.event.start).format('HH:mm'))
const end = computed(() =>dayjs( props.event.end).format('HH:mm'))

onMounted(() => {
  console.log('ici onMounted event demande')
  SetupCSS()
})

/**
 * Override base CSS inset style to fit the bar rendering process.
 * Take the ID of the event, and retrieve the parent event container, then replace
 * the inset values with the z-index as indexer.
 */
function SetupCSS() {
  const css_event = document.querySelector(`#event-demande-${props.event.id}`)
  console.log('ici css event récupéré dans event demande ------ ')
  console.log(css_event?.textContent)
  if (css_event) {
    const harness = css_event.parentElement?.parentElement?.parentElement;
    const event = css_event.parentElement;
    if (harness) {
      let index = Math.abs(parseInt(harness.style.zIndex));
      const order_index = index > 100 ? Math.abs(200 - index) : index;
      const inset_values = harness.style.inset.split(' ')
      if (inset_values[3]) {
        inset_values[3] = `${15 * (order_index - 1)}px`
        harness.style.inset = inset_values.join(' ')
      }
      harness.style.pointerEvents = "none"
      harness.style.zIndex = `${-order_index + 200}`;
    }

    if(event) {
      console.log('ici event demande --- ')
      console.log(event.textContent)
      event.setAttribute('draggable', 'false');
    }
  }
}
</script>

<style>
.fc-event-demande {
  pointer-events: all;
  position: relative;
  width: 10px !important;
  background-color: var(--fc-event-bg-color) !important;
  box-shadow: none !important;
  cursor: pointer;
}

.fc-event-demande:hover {
  transition: 1000ms cubic-bezier(0.19, 1, 0.22, 1);
  background-color: #2e5c8d !important;
}

.event-demande-wrapper {
  transition: 1000ms cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: none;
  position: absolute;
  width: 0px;
  top: 0;
  left: 15px;
  height: 100%;
  padding: 10px;
  line-height: 1rem;
}

.event-demande-content {
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}

.fc-event-demande:hover .event-demande-wrapper {
  transition: 1000ms cubic-bezier(0.19, 1, 0.22, 1);
  background-color: #b2ceeb;
  border-radius: 5px;
  width: 150px;
}
</style>

<style scoped>
.information {
  color: var(--fc-event-bg-color);
}

.title {
  color: black;
  font-weight: 600;
}

.hour {
  color: black;
}
</style>