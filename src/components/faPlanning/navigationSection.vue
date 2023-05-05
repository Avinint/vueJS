<template>
  <section class="flex flex-col">
    <h3 class="nav-title pb-4 text-sm font-semibold text-black">
      <slot name="title"></slot>
    </h3>
    <div class="flex items-center justify-start">
      <slot name="content"></slot>
    </div>
  </section>
</template>

<style scopped>
button {
  @apply mr-4;
}
</style>
