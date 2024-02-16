<template>
  <Card class="space-y-3">
    <h1>Préférences et confidentialité</h1>
    <div class="border border-slate-300 rounded-lg">
      <CardModalSection title="Gestion des emails" class="pt-6">
        <div class="p-9">
          <div class="flex w-full border border-grey-300">
            <div class="w-1/2 p-4 border-r border-grey-300 bg">
              <p>Réception de tous les e-mails Fit Arena</p>
            </div>
            <div class="flex w-1/2 p-4">
              <p class="pr-4 w-16">{{ emailingCollectivite ? 'Actif' : 'Inactif' }}</p>
              <label class="relative inline-flex cursor-pointer">
                <input
                  v-model="emailingCollectivite"
                  type="checkbox"
                  class="peer sr-only"
                  @change="modifEmailingUser(emailingCollectivite)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
            </div>
          </div>
        </div>
      </CardModalSection>
    </div>
  </Card>
</template>

<script setup>
import Card from '@components/common/Card.vue'
import CardModalSection from '@components/common/CardModalSection.vue'

import { onMounted, ref } from 'vue'
import { toast } from "vue3-toastify"

import { useUserStore } from '@stores/user.js'
import { getUser, patchUser } from '@api/user'

const userStore = useUserStore()
const emailingCollectivite = ref(false)

onMounted(async () => {
  await getUser(userStore.id).then(response => {
    emailingCollectivite.value = response.emailingCollectivite
  })
})

const modifEmailingUser = async (emailingCollectivite) => {
  try {
    await patchUser({ emailingCollectivite }, userStore.id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}
</script>

<style scoped>
.bg {
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}
</style>