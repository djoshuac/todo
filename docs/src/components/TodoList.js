const { ref, onUpdated, watch } = Vue




export default {
    props: ['listName'],

    setup(props) {
        function computeStorageKey(listName) {
            return `items-${listName}`;
        }

        function loadItems() {
            const data = localStorage.getItem(storageKey) ?? '[]'
            return JSON.parse(data)
        }

        function saveItems() {
            localStorage.setItem(storageKey, JSON.stringify(items.value))
        }

        let storageKey = computeStorageKey(props.listName)
        const items = ref(loadItems())

        watch(() => props.listName, (newListname, oldListName) => {
            if (newListname == oldListName) {
                return;
            }

            console.log(newListname)
            storageKey = computeStorageKey(newListname)
            items.value = loadItems(newListname)
        })

        let draggedItem = undefined;
        onUpdated(() => {
            saveItems()
        })

        const component = {
            items,

            dragstart: (event, item) => {
                draggedItem = item
                event.target.classList.add('dragged')
                event.dataTransfer.dropEffect = 'copy'
                event.dataTransfer.setData('text', item.id)
            },
            dragover: (event, item) => {
                event.preventDefault();
                event.target.classList.add('draghover')
            },
            dragleave: (event, item) => {
                event.target.classList.remove('draghover')
            },
            dragend: (event, item) => {
                event.preventDefault();
                event.target.classList.remove('dragged')
                // wait for dragged item to settle before refocussing 
                Vue.nextTick(() => {
                    component.focusItem(draggedItem)
                    draggedItem = undefined
                })
            },
            drop: (event, item) => {
                event.target.classList.remove('draghover')
                event.stopPropagation()
                event.preventDefault()

                const oldIndex = items.value.indexOf(draggedItem)
                let newIndex = items.value.indexOf(item)
                if (item == null) {
                    newIndex = items.value.length // place at end if no item matched
                }
                items.value.splice(oldIndex, 1)
                items.value.splice(newIndex, 0, draggedItem)
            },
            markItemCompleted: (item) => {
                const index = items.value.indexOf(item)
                if (index != -1) {
                    items.value.splice(index, 1, {
                        message: item.message,
                        done: !(item.done === true),
                    })
                }
            },
            deleteItem: (item) => {
                const index = items.value.indexOf(item)
                if (index != -1) {
                    items.value.splice(index, 1)
                }
            },


            focusItem(item) {
                if (item != null) {
                    const inputs = document.querySelectorAll('.card > input')
                    const index = items.value.indexOf(item)
                    if (index !== -1 && index < inputs.length) {
                        inputs[index].focus()
                    }
                }
            },
            focusNext: (item) => {
                const index = items.value.indexOf(item)
                if (index == items.value.length - 1) {
                    component.addNewItem()
                    // wait for new item to render before focussing it
                    Vue.nextTick(() => {
                        component.focusItem(items.value[index+1])
                    })
                } else {
                    component.focusItem(items.value[index+1])
                }
            },
            focusPrev: (item) => {
                const index = items.value.indexOf(item)
                const focusIndex = Math.max(0, index - 1)

                // wait for item to potentially be deleted
                Vue.nextTick(() => {
                    if (items.value.length > 0) {
                        component.focusItem(items.value[focusIndex])
                    }
                })
            },

            deleteIfEmpty: (event, item) => {
                if (item.message === '') {
                    component.focusPrev(item)
                    component.deleteItem(item)
                }
            },

            addNewItem: () => {
                items.value.push({
                    message: '',
                    done: false,
                })
            },
        }

        return component;
    },

    template: '#component-todo-list',
}
