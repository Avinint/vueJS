import Modal from '../components/common/Modal.vue'

import 'tailwindcss/tailwind.css'

export default {
  title: 'Page/Login',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    title: {type: 'input'}
  },
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: { Modal },
  setup() {
    return { args };
  },
  template: `<Modal v-bind="args">
    TEST MODAL
  </Modal>`,
});

export const Primary = Template.bind({});
Primary.args = { title: 'Button' };
