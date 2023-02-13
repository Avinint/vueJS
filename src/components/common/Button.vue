<template>
  <button :class="[type, icon_placement]" type="button" data-modal-toggle="add-user-modal" class="flex items-center space-x-1 justify-center px-3 py-2 text-sm font-medium text-center rounded-lg">
    <div v-if="icon" v-html="icon"></div>
    <div v-if="props.label">
      {{props.label}}
    </div>
  </button>
</template>

<script setup lang="ts">

import {defineProps} from "vue";

  interface Props {
      label?: string
      icon?: 'reload' | 'edit' | 'add' | 'export' | '',
      type?: 'info' | 'danger' | 'warning' | 'success' | 'secondary' | ''
  }

  const ICON = {
    add: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>',
    reload: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M4.3 12.05q-.525 0-.837-.362q-.313-.363-.188-.863q.15-.625.4-1.213q.25-.587.575-1.137q.275-.425.738-.475q.462-.05.862.325q.2.2.263.537q.062.338-.113.613q-.275.425-.45.887q-.175.463-.3.938q-.075.325-.337.537q-.263.213-.613.213Zm5.475 9.725q-.6-.15-1.187-.4q-.588-.25-1.163-.575q-.425-.275-.475-.738q-.05-.462.325-.862q.2-.2.537-.262q.338-.063.613.112q.425.275.887.45q.463.175.938.3q.325.075.538.337q.212.263.212.613q0 .525-.363.837q-.362.313-.862.188Zm-5.525-4.15q-.325-.575-.575-1.163q-.25-.587-.4-1.187q-.125-.5.188-.863q.312-.362.887-.362q.3 0 .563.212q.262.213.337.538q.125.475.3.938q.175.462.45.887q.175.275.125.6q-.05.325-.275.55q-.375.375-.85.325q-.475-.05-.75-.475Zm9.975 4.125q-.5.125-.862-.175q-.363-.3-.363-.825q0-.3.213-.587q.212-.288.537-.363q2.325-.575 3.788-2.45Q19 15.475 19 13.05q0-2.925-2.038-4.962Q14.925 6.05 12 6.05h-.2l.9.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275l-2.6-2.6q-.15-.15-.212-.325q-.063-.175-.063-.375t.063-.375Q8.55 4.5 8.7 4.35l2.6-2.6q.275-.275.7-.275q.425 0 .725.275q.275.3.275.725t-.275.7l-.875.875H12q3.75 0 6.375 2.625T21 13.05q0 3.1-1.9 5.5t-4.875 3.2Z"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h1.4l8.625-8.625l-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2l1.4-1.4q.575-.575 1.413-.575q.837 0 1.412.575l1.4 1.4q.575.575.6 1.388q.025.812-.55 1.387ZM17.85 10.4L7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725l-.7-.7l1.4 1.4Z"/></svg>',
    delete: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1ZM7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM7 6v13Z"/></svg>',
    export: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="m16.2 20.5l2.8-2.8V20h1v-4h-4v1h2.3l-2.8 2.8ZM5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v6.7q-.475-.225-.975-.388q-.5-.162-1.025-.237V5H5v14h6.05q.075.55.238 1.05q.162.5.387.95Zm0-3v1V5v6.075V11v7Zm2-1h4.075q.075-.525.237-1.025q.163-.5.363-.975H7Zm0-4h6.1q.8-.75 1.787-1.25q.988-.5 2.113-.675V11H7Zm0-4h10V7H7Zm11 14q-2.075 0-3.537-1.462Q13 20.075 13 18q0-2.075 1.463-3.538Q15.925 13 18 13t3.538 1.462Q23 15.925 23 18q0 2.075-1.462 3.538Q20.075 23 18 23Z"/></svg>',
    '': ''
  }

  const TYPE = {
    info: 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white',
    danger: 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 text-white',
    warning: 'bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 text-white',
    success: 'bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 text-white',
    secondary: ' focus:ring-blue-300 border',
    '': 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white'
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    icon: '',
    icon_placement: 'right',
    type: ''
  })

  const icon = ICON[props.icon]
  const type = TYPE[props.type]
  const icon_placement = props.icon_placement === 'left' ? 'flex-row-reverse' : ''

</script>
