const { ref } = Vue

export default {
  props: ['tabs', 'selectedTab', 'selectTab'],

  setup(props) {
    return {
      tabs: props.tabs,
      selectedTab: props.selectedTab,

      selectTab: props.selectTab,
    }
  },

  template: '#component-tab-selector',
}
