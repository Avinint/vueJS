import Input from '../components/common/Input.vue'

import 'tailwindcss/tailwind.css'

export default {
  title: 'Page/Login',
  tags: ['autodocs'],
  argTypes: {
    mail_title: { type: 'string', defaultValue: 'Votre E-mail' },
    mdp_title: { type: 'string', defaultValue: 'Mot de passe' },
  },
}

const Template = (args) => ({
  components: { Input },
  setup() {
    return { args }
  },
  template: `<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="/src/assets/logo.png" alt="logo">
          FitArena
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form class="space-y-4 md:space-y-6" @submit.prevent="login()">
              <Input v-model="mail" :label="args.mail_title" placeholder="name@company.com" type="email" :id="'email'" :inline="false" :test="'email'"/>
              <Input v-model="password" :label="args.mdp_title" placeholder="••••••••" type="password" :id="'password'" :test="'password'" :inline="false"/>
              <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Se connecter</button>
            </form>
          </div>
        </div>
  </div>`,
})

export const Primary = Template.bind({})
Primary.args = { title: 'Button' }
