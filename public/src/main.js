const { createApp, ref, onUpdated } = Vue

import TabSelector from './components/TabSelector.js'
import TodoList from './components/TodoList.js'

createApp({
    components: {
        TabSelector,
        TodoList,
    },
    setup() {
        const tabs = ref(['test', 'groceries', 'app todo', 'a long tab hyh'])
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
