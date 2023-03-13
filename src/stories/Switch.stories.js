import Switch from '../components/common/Switch.vue'

import 'tailwindcss/tailwind.css'

export default {
  title: 'Common/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    readonly: {type: 'boolean'}
  },
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: { Switch },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = { };
