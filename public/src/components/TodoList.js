const { ref, onUpdated } = Vue

export default {
    props: ['listName'],

    setup(props) {
        const storageKey = `items-${props.listName}`;
        console.log(storageKey)

        const data = localStorage.getItem(storageKey) ?? '[]'
        const items = ref(JSON.parse(data))
        document.querySelector('#app').style.visibility = 'visible'

        function focusItem(item) {
            if (item != null) {
                const inputs = document.querySelectorAll('.card > input')
                const index = items.value.indexOf(item)
                if (index !== -1 && index < inputs.length) {
                    inputs[index].focus()
                }
            }
        }

        let draggedItem = undefined;
        onUpdated(() => {
            localStorage.setItem(storageKey, JSON.stringify(items.value))
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
                    focusItem(draggedItem)
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
            deleteItem: (item) => {
                const index = items.value.indexOf(item)
                if (index != -1) {
                    items.value.splice(index, 1)
                }
            },
            focusNext: (item) => {
                const index = items.value.indexOf(item)
                if (index == items.value.length - 1) {
                    component.addNewItem()
                    // wait for new item to render before focussing it
                    Vue.nextTick(() => {
                        focusItem(items.value[index+1])
                    })
                } else {
                    focusItem(items.value[index+1])
                }
            },

            addNewItem: () => {
                items.value.push({
                    message: '',
                })
            },
        }

        return component;
    },

    template: '#component-todo-list',
}
