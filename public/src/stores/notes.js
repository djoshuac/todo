import { reactive } from Vue

export const notes = reactive({
    load(tab) {
        const storageKey = `items-${tab}`;
        const data = localStorage.getItem(storageKey) ?? '[]'
        this.items = JSON.parse(data)
        this.tab = tab
    },

    tab: 'test',
    setActiveTab(tab) {
        this.load(tab);
    },
})