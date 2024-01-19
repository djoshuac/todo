const {} = Vue

export default {
  emits: ['selectTab'],
  props: ['tabs', 'selectedTab'],

  setup() {
    return {}
  },

  template: '#component-tab-selector',
}
