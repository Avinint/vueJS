<template>
  <div class="flex">
    <section class="flex flex-col">
      <h3 class="nav-title text-sm text-black mb-4">
        <slot name="title"></slot>
      </h3>
      <div class="flex items-center">
        <slot name="content"></slot>
      </div>
    </section>
  </div>
</template>

<style scoped>
button {
  @apply mr-4;
}
</style>
