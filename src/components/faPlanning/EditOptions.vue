<template>
	<div ref="wrapper" class="wrapper" :class="{open: is_open, anim: anim}">
		<a href="#" @click.prevent="emits('onEditSingle'); close()">Modifier ce créneau</a>
		<a href="#" @click.prevent="emits('onEditMultiple'); close()">Modifier les récurences</a>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside, useMouse } from '@vueuse/core';
import { reactive, ref } from 'vue';

const is_open = ref(false);
const anim = ref(false);
const wrapper = ref<HTMLElement>();
const emits = defineEmits(['onEditSingle', 'onEditMultiple'])
defineExpose({ open });
const mouse = reactive(useMouse());

function open() {
	anim.value = false;
	
	setTimeout(() => {
		if(!is_open.value && wrapper.value) {
			wrapper.value.style.top = `${mouse.y}px`;
			wrapper.value.style.left = `${mouse.x}px`;
			anim.value = true;
		}
		is_open.value = true;
	}, 5)
}

function close() {
		is_open.value = false;
		anim.value = false;
}

onClickOutside(wrapper, () => {
	if(is_open.value) {
		is_open.value = false;
		anim.value = false;
	}
})
</script>

<style scoped>
.wrapper {
	z-index: 999;
	background-color: white;
	position: absolute;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	width: 200px;
	max-width: 0px;
	top: 0;
	left: 0;
	border-radius: 10px;
	white-space: nowrap;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5) ;
	opacity: 0;
}

@keyframes open {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}	
}

.anim {
	animation: open 1s cubic-bezier(0.19, 1, 0.22, 1);
	opacity: 1;
	max-width: 200px;
	padding: 5px;
}

.wrapper a {
	border-radius: 5px;	
	padding: 5px;
}

.wrapper a:hover {
	transition: 1s cubic-bezier(0.19, 1, 0.22, 1);
	background-color: rgba(99, 141, 231, 0.185);
}
</style>