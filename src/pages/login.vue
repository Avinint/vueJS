<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-8 h-8 mr-2" src="../assets/logo.png" alt="logo">
        FitArena
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form class="space-y-4 md:space-y-6" @submit.prevent="login()">
            <Input v-model="mail" label="Votre E-mail" placeholder="name@company.com" type="email" :id="'email'" :inline="false" :test="'email'"/>
            <Input v-model="password" label="Mot de passe" placeholder="••••••••" type="password" :id="'password'" :test="'password'" :inline="false"/>
            <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

  import {ref} from "vue";
  import {useRouter} from "vue-router";
  import {useUserStore} from "../stores/user.js";
  import Input from "../components/common/Input.vue";

  const router = useRouter()
  const mail = ref('')
  const password = ref('')

  const user = useUserStore()

  const login = async () => {
    try {
      await user.login(mail.value, password.value)
      await router.push('/')
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }

  if (user.connected)
    router.push('/')

</script>
