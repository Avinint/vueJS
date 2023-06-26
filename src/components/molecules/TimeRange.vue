<template>
  <div class="flex">
    <select
      v-model="start_time"
      required
      class="w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      @change="updateStartTime"
    >
      <option
        v-for="(creneauHoraire, i) in getOptions()"
        :key="i"
        :value="creneauHoraire"
      >
        {{ creneauHoraire }}
      </option>
    </select>
    <div class="px-4 py-2">à</div>
    <select
      v-model="end_time"
      required
      class="w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      @change="updateEndTime"
    >
      <option
        v-for="(creneauHoraire, i) in getOptions()"
        :key="i"
        :value="creneauHoraire"
      >
        {{ creneauHoraire }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { f0 } from '../../services/date_service';
import { ref } from 'vue';

const props = defineProps({
    minute_gap: {
        type: Number,
        default: 15,
    },
    start: {
        type: Number,
        default: 0,
    },
    end: {
        type: Number,
        default: 24,
    },
    start_time: String,
    end_time: String,
});

const emits = defineEmits(['update:start_time', 'update:end_time']);

const start_time = ref(props.start_time ?? '00:00');
const end_time = ref(props.end_time ?? '00:00');

function getOptions(): string[] {
    const options: string[] = [];
    let hour = props.start ?? 0;
    let minute = 0;

    while(hour < props.end) {
        options.push(`${f0(hour)}:${f0(minute)}`);
        minute += props.minute_gap;
        if(minute >= 60) {
            hour++;
            minute = minute - 60;
        }
    }

    return options; 
}

function updateStartTime(e: Event) {
    emits('update:start_time', (e.target as HTMLInputElement).value);    
}

function updateEndTime(e: Event) {
    emits('update:end_time', (e.target as HTMLInputElement).value);    
}
</script>
