import Modal from '../components/common/Modal.vue'

import { action } from '@storybook/addon-actions'

import 'tailwindcss/tailwind.css'

export default {
  title: 'Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    title: { type: 'input' },
    type: {
      control: { type: 'radio' },
      options: ['classic', 'alert'],
    },
  },
}

//👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: { Modal },
  setup() {
    return { args }
  },
  template: `<Modal v-bind="args" @cancel="cancel" @confirm="confirm">
    TEST MODAL
  </Modal>`,
  methods: {
    cancel: action('cancel'),
    confirm: action('confirm'),
  },
})

export const Primary = Template.bind({})
Primary.args = { title: 'Button' }
