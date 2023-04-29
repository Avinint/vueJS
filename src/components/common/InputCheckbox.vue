<template>
  <div v-for="item in list" :key="item.id">
    <input
      :id="item.id"
      type="checkbox"
      :value="item.id"
      @input="handleInput"
    />
    <label
      class="mb-3 mr-9 inline-block cursor-pointer rounded-lg border-none bg-neutral-200 px-6 py-3 text-sm text-black drop-shadow-sm peer-checked:bg-sky-600 peer-checked:text-white"
      :for="item.id"
    >
      {{ item.libelle }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      content: this.value,
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', this.content)
    },
  },
}
</script>

<style></style>
