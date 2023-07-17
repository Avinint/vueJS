<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0"
    >
      <a
        href="#"
        class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img class="mr-2 h-8 w-8" src="../assets/logo.png" alt="logo" />
        FitArena
      </a>
      <div
        class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
      >
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <form class="space-y-4 md:space-y-6" @submit.prevent="login()">
            <Input
              :id="'email'"
              v-model="mail"
              v-model:valid="validation.email"
              label="Votre E-mail"
              placeholder="name@company.com"
              type="email"
              :inline="false"
              :test="'email'"
              :validation="[emailValidation, requiredValidation]"
            />
            <Input
              :id="'password'"
              v-model="password"
              label="Mot de passe"
              placeholder="••••••••"
              type="password"
              :test="'password'"
              :inline="false"
            />
            <button
              type="submit"
              class="w-full rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import Input from '../components/common/Input.vue'
import { emailValidation, requiredValidation, isValid } from '../validation.js'
import { toast } from 'vue3-toastify'

const router = useRouter()
const mail = ref('')
const password = ref('')

const user = useUserStore()

const validation = ref({})

const login = async () => {
  if (!isValid(validation)) return
  try {
    await user.login(mail.value, password.value)
    await router.push('/')
  } catch (e) {
    if(e instanceof Response) {
      if(e.status == 401) {
        toast.error("Identifiants invalides.");
        return;
      }

      toast.error("Une erreur est survenue.");
    }
  }
}

if (user.connected) router.push('/')
</script>
