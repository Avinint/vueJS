<template>
  <Modal
    type="none"
    size="2xl"
    title="QR CODE SÉANCE"
    v-if="is_open && qrcode"
    @cancel="close"
  >
    <div class="w-full flex flex-col items-center">
      <BorderContainer class="w-64 mb-4">
        <h2>QR CODE SÉANCE</h2>
        <img :src="qrcode" alt="qrcode_seance" />
      </BorderContainer>
      <p class="text-center w-64">
        Ce QR code doit être partagé à tous les participants de la séance
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { getQRCode } from '@api/seance'
import BorderContainer from '@components/common/BorderContainer.vue'
import Modal from '@components/common/Modal.vue'
import { ref } from 'vue'

defineExpose({ open, close, setSeance })

const is_open = ref(false)
const qrcode = ref<string>()

function open() {
  is_open.value = true
}

function close() {
  is_open.value = false
}

function setSeance(seance: Seance) {
  qrcode.value = undefined;
  getQRCode(seance.id).then((response) => {
    qrcode.value = response.qrcode
  })
}
</script>
