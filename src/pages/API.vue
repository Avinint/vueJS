<template>
  <section>
    <nav>
      <Button @click="fetchApi">fetch</Button>
    </nav>
    <textarea id="" v-model="response" name="" cols="130" rows="33"> </textarea>
  </section>
</template>

<script>
import { usePlanningStore } from '@stores/planning.js'
import { mapStores } from 'pinia'
import { getPlanning } from '@api/planning.js'
import Button from '@components/commons/Button'

export default {
  components: ['Button'],
  data() {
    return {
      response: '',
    }
  },
  methods: {
    async fetchApi() {
      this.response = await getPlanning()
      this.response = JSON.stringify(this.response)
    },
  },
}
</script>
