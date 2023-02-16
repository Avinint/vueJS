import Button from '../components/common/Button.vue'

import 'tailwindcss/tailwind.css'

export default {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: {type: 'radio'},  options: ['info', 'danger', 'warning', 'success', 'secondary'],
    },
    icon: {
      control: {type: 'radio'},  options: ['reload', 'edit', 'add', 'export', 'logout', 'cross'],
    },
    icon_placement: {
      control: {type: 'radio'},  options: ['right', 'left'],
    },
    label: {type: 'text'}
  },
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = { type: 'info', label: 'Button' };
