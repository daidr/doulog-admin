import {
  Node,
} from '@tiptap/core'



export const Title = Node.create({
  name: 'title',
  defining: true,
  content: 'text*',
  marks: '',
  renderHTML() {
    return ['h1', { class: 'title' }, 0]
  },
})
