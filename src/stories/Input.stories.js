import Input from '../components/common/Input.vue'

import 'tailwindcss/tailwind.css'

export default {
  title: 'Common/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {},
}

const Template = (args) => ({
  components: { Input },
  setup() {
    return { args }
  },
  template: `<Input v-bind="args" v-model="args.val"/>`,
})

export const Primary = Template.bind({})
Primary.args = { placeholder: 'placeholder' }
