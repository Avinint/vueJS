<template>
  <button :class="[couleur, icon_placement, border]" :type="submit ? 'submit' : 'button'" data-modal-toggle="add-user-modal" class="inline-flex items-center space-x-1 justify-center px-3 py-2 text-sm font-medium text-center rounded-lg">
    <div v-if="icon" v-html="icon"></div>
    <div v-if="props.label">
      {{props.label}}
    </div>
  </button>
</template>

<script setup lang="ts">

import { computed } from 'vue'

  const ICON = {
   search: '<svg aria-hidden="true" class="h-5 w-5 currentColor0" fill="none" stroke="currentColor" viewBox="0 0 24 24"xmlns="http://www.w3.org/2000/svg">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" ></path>' +
    '</svg>',
    print: '<svg class="w-6 h-6 text-gray-800 dark:text-white" width="22" height="22" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20">\n' +
        '    <path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z"/>\n' +
        '    <path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z"/>\n' +
        '  </svg>',
    add: '<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.44271 12.6665H9.69271V9.20817H13.1719V7.95817H9.69271V4.33317H8.44271V7.95817H4.83854V9.20817H8.44271V12.6665ZM9.00521 16.8332C7.86632 16.8332 6.78993 16.6144 5.77604 16.1769C4.76215 15.7394 3.87674 15.1422 3.11979 14.3853C2.36285 13.6283 1.76562 12.7429 1.32812 11.729C0.890625 10.7151 0.671875 9.63178 0.671875 8.479C0.671875 7.34012 0.890625 6.26373 1.32812 5.24984C1.76562 4.23595 2.36285 3.354 3.11979 2.604C3.87674 1.854 4.76215 1.26025 5.77604 0.822754C6.78993 0.385254 7.87326 0.166504 9.02604 0.166504C10.1649 0.166504 11.2413 0.385254 12.2552 0.822754C13.2691 1.26025 14.151 1.854 14.901 2.604C15.651 3.354 16.2448 4.23595 16.6823 5.24984C17.1198 6.26373 17.3385 7.34706 17.3385 8.49984C17.3385 9.63873 17.1198 10.7151 16.6823 11.729C16.2448 12.7429 15.651 13.6283 14.901 14.3853C14.151 15.1422 13.2691 15.7394 12.2552 16.1769C11.2413 16.6144 10.158 16.8332 9.00521 16.8332ZM9.02604 15.5832C10.9844 15.5832 12.651 14.8922 14.026 13.5103C15.401 12.1283 16.0885 10.4512 16.0885 8.479C16.0885 6.52067 15.401 4.854 14.026 3.479C12.651 2.104 10.9774 1.4165 9.00521 1.4165C7.04688 1.4165 5.37674 2.104 3.99479 3.479C2.61285 4.854 1.92188 6.52762 1.92188 8.49984C1.92188 10.4582 2.61285 12.1283 3.99479 13.5103C5.37674 14.8922 7.05382 15.5832 9.02604 15.5832Z" fill="currentColor"/></svg>',
    reload: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M4.3 12.05q-.525 0-.837-.362q-.313-.363-.188-.863q.15-.625.4-1.213q.25-.587.575-1.137q.275-.425.738-.475q.462-.05.862.325q.2.2.263.537q.062.338-.113.613q-.275.425-.45.887q-.175.463-.3.938q-.075.325-.337.537q-.263.213-.613.213Zm5.475 9.725q-.6-.15-1.187-.4q-.588-.25-1.163-.575q-.425-.275-.475-.738q-.05-.462.325-.862q.2-.2.537-.262q.338-.063.613.112q.425.275.887.45q.463.175.938.3q.325.075.538.337q.212.263.212.613q0 .525-.363.837q-.362.313-.862.188Zm-5.525-4.15q-.325-.575-.575-1.163q-.25-.587-.4-1.187q-.125-.5.188-.863q.312-.362.887-.362q.3 0 .563.212q.262.213.337.538q.125.475.3.938q.175.462.45.887q.175.275.125.6q-.05.325-.275.55q-.375.375-.85.325q-.475-.05-.75-.475Zm9.975 4.125q-.5.125-.862-.175q-.363-.3-.363-.825q0-.3.213-.587q.212-.288.537-.363q2.325-.575 3.788-2.45Q19 15.475 19 13.05q0-2.925-2.038-4.962Q14.925 6.05 12 6.05h-.2l.9.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275l-2.6-2.6q-.15-.15-.212-.325q-.063-.175-.063-.375t.063-.375Q8.55 4.5 8.7 4.35l2.6-2.6q.275-.275.7-.275q.425 0 .725.275q.275.3.275.725t-.275.7l-.875.875H12q3.75 0 6.375 2.625T21 13.05q0 3.1-1.9 5.5t-4.875 3.2Z"/></svg>',
    edit: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.375 12.6246H2.2L10.5062 4.31836L9.68125 3.49336L1.375 11.7996V12.6246ZM12.8875 3.51211L10.4875 1.11211L11.275 0.324609C11.4875 0.112109 11.75 0.00585938 12.0625 0.00585938C12.375 0.00585938 12.6375 0.112109 12.85 0.324609L13.675 1.14961C13.8875 1.36211 13.9938 1.62461 13.9938 1.93711C13.9938 2.24961 13.8875 2.51211 13.675 2.72461L12.8875 3.51211ZM12.1 4.29961L2.65 13.7496H0.25V11.3496L9.7 1.89961L12.1 4.29961ZM10.0938 3.90586L9.68125 3.49336L10.5062 4.31836L10.0938 3.90586Z" fill="black"/></svg>',
    delete: '<svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.95653 15.1102C1.61046 15.1102 1.31631 14.9869 1.07406 14.7403C0.831817 14.4937 0.710695 14.1942 0.710695 13.8419V1.79222H-0.140625V0.52384H3.76299V-0.110352H9.24465V0.52384H13.1483V1.79222H12.2969V13.8419C12.2969 14.1801 12.1724 14.476 11.9232 14.7297C11.674 14.9834 11.3833 15.1102 11.0511 15.1102H1.95653ZM11.0511 1.79222H1.95653V13.8419H11.0511V1.79222ZM4.1575 12.0238H5.40333V3.5891H4.1575V12.0238ZM7.60431 12.0238H8.85014V3.5891H7.60431V12.0238ZM1.95653 1.79222V13.8419V1.79222Z" fill="black"/></svg>',
    export: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="m16.2 20.5l2.8-2.8V20h1v-4h-4v1h2.3l-2.8 2.8ZM5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v6.7q-.475-.225-.975-.388q-.5-.162-1.025-.237V5H5v14h6.05q.075.55.238 1.05q.162.5.387.95Zm0-3v1V5v6.075V11v7Zm2-1h4.075q.075-.525.237-1.025q.163-.5.363-.975H7Zm0-4h6.1q.8-.75 1.787-1.25q.988-.5 2.113-.675V11H7Zm0-4h10V7H7Zm11 14q-2.075 0-3.537-1.462Q13 20.075 13 18q0-2.075 1.463-3.538Q15.925 13 18 13t3.538 1.462Q23 15.925 23 18q0 2.075-1.462 3.538Q20.075 23 18 23Z"/></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" class="transform -rotate-90"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a9.985 9.985 0 0 1 8 4h-2.71a8 8 0 1 0 .001 12h2.71A9.985 9.985 0 0 1 12 22zm7-6v-3h-8v-2h8V8l5 4l-5 4z"/></svg>',
    cross: '<svg aria-hidden="true" class="w-5 h-5" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>',
    '': ''
  }

  const TYPE = {
    info: 'bg-gray-300 hover:bg-gray-400 text-black',
    submit: 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white',
    danger: 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 text-white',
    warning: 'bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 text-white',
    success: 'bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 text-white',
    secondary: ' focus:ring-blue-300 bg-white',
    '': 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white'
  }

  interface Props {
    label?: string,
    icon_placement?: 'left' | 'right'
    icon?: 'reload' | 'edit' | 'add' | 'export' | 'logout' | 'cross' | 'delete' | 'print' | 'search' | '',
    couleur?: 'info' | 'danger' | 'warning' | 'success' | 'secondary' | 'submit' | '',
    borderless: boolean,
    submit: boolean,
  }

  const props = withDefaults(defineProps<Props>(), {
    borderless: false,
    submit: false,
    icon_placement: 'right'
  });

  const icon: string = ICON[props.icon ?? '']
  const couleur: string = TYPE[props.couleur ?? '']
  const border: string = props.borderless ? '' : 'border'
  const icon_placement: string = props.icon_placement === 'left' ? 'row-reverse' : ''

</script>
