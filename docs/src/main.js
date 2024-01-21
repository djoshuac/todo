const { createApp, ref, onUpdated } = Vue

import TabSelector from './components/TabSelector.js'
import TodoList from './components/TodoList.js'

createApp({
    components: {
        TabSelector,
        TodoList,
    },
    setup() {
        const tabs = ref(['groceries', 'app todo'])
        const selectedTab = ref(tabs.value[0]);

        return {
            tabs,
            selectedTab,
            
            selectTab: (tab) => {
                selectedTab.value = tab
            },
        }
    }
}).mount('#app')
