<script setup lang="ts">
import Blockquote from '@tiptap/extension-blockquote'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, Editor, EditorContent, type JSONContent } from '@tiptap/vue-3'
import { TrailingNode } from './extensions/trailing-node'
import { InsertBetween } from './extensions/insert-between'
import Commands from './extensions/commands'
import suggestion from './extensions/suggestion'
import Document from '@tiptap/extension-document'
import { Title } from './extensions/title'
import { defaultBlockTools } from './tools/block.tools'
import Details from '@tiptap-pro/extension-details'
import DetailsContent from '@tiptap-pro/extension-details-content'
import DetailsSummary from '@tiptap-pro/extension-details-summary'
import { DragHandle } from '@tiptap-pro/extension-drag-handle-vue-3'
import NodeRange from '@tiptap-pro/extension-node-range'


const CustomDocument = Document.extend({
  content: 'title (block|horizontalRule)+',
})

const {
  titlePlaceholder = '请输入标题',
  placeholder = '输入 / 来选择区块',
} = defineProps<{
  titlePlaceholder?: string,
  placeholder?: string
}>()

const allBlockTools = defaultBlockTools()

let editor = ref<Editor>()

const isTyping = ref(false)
const editorRef = useTemplateRef('editorRef')

const title = defineModel('title', { default: '' })
const content = defineModel('content', { default: '' })

let innerTitle = ''
let innerContent = ''

function getTextFromTitleNode(node: JSONContent) {
  let finalText = ''
  if (node.type === 'title' && Array.isArray(node.content)) {
    for (const subnode of node.content) {
      if (subnode.text) {
        finalText += subnode.text
      }
    }
  }

  return finalText
}

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      CustomDocument,
      Title,
      StarterKit.configure({
        blockquote: false,
        document: false,
      }),
      NodeRange.configure({
        key: null,
      }),
      Details.configure({
        persist: true,
        HTMLAttributes: {
          class: 'details',
        },
      }),
      DetailsSummary,
      DetailsContent,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'title') {
            return titlePlaceholder
          }

          return placeholder
        },
        showOnlyCurrent: true
      }),
      Blockquote.extend({
        content: 'paragraph',
      }),
      TrailingNode,
      InsertBetween,
      Subscript,
      Superscript,
      Highlight,
      Commands.configure({
        suggestion: suggestion(allBlockTools),
      }),
      Link.configure({
        openOnClick: false,
      }),
      // BlockWidth.configure({
      //   types: this.blockWidthTypes,
      // }),
      // Variants.configure({
      //   types: this.variantsTypes,
      // }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow.extend({
        allowGapCursor: false,
      }),
      TableHeader.extend({
        content: '(inline|hardBreak?)*',
        isolating: false,
      }),
      TableCell.extend({
        content: '(inline|hardBreak?)*',
        isolating: false,
      }),
    ],
    onUpdate({ editor }) {
      const json = editor.getJSON()
      console.log('out', json)
      if (!json.content) {
        return
      }
      const titleNode = json.content[0]

      if (titleNode.type === 'title') {
        title.value = innerTitle = getTextFromTitleNode(titleNode)
      }
      content.value = innerContent = JSON.stringify(json.content.slice(1))
    }
  })

  window.addEventListener('pointermove', cancelTyping, { passive: true })

  watch([title, content], ([newTitle, newContent]) => {
    if (newTitle === innerTitle && newContent === innerContent) {
      return
    }
    try {
      const parsedContent = JSON.parse(newContent)
      const doc = {
        type: 'doc',
        content: [
          {
            type: 'title',
            content: [{
              type: 'text',
              text: newTitle,
            }]
          },
          ...parsedContent,
        ],
      }
      innerTitle = newTitle
      innerContent = newContent
      console.log('in', doc)
      editor.value?.commands.setContent(doc)
    } catch (e) {
      console.error(e)
    }
  }, {
    immediate: true,
  })
})

function cancelTyping() {
  nextTick(() => {
    isTyping.value = false
  })
}

onBeforeUnmount(() => {
  editor.value?.destroy()
  window.removeEventListener('pointermove', cancelTyping)
})




</script>

<template>
  <template v-if="editor">
    <DragHandle :editor="editor">
      <div class="custom-drag-handle" />
    </DragHandle>
    <EditorContent v-if="editor" ref="editorRef" class="prose" v-bind="$attrs" :editor="editor" @keydown="isTyping = true"
      @keyup.esc="isTyping = false" />
  </template>
</template>

<style scoped lang="scss">
.custom-drag-handle {
  &::after {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    width: 2rem;
    height: 2rem;
    content: '⠿';
    font-weight: 700;
    cursor: grab;
    color: #0D0D0D70;
    border-radius: 0.25rem;
  }

  &:hover {
    &::after {
      background: #0D0D0D10;
    }
  }
}

.prose {
  @apply overflow-y-auto flex flex-col;

  :deep() {
    .ProseMirror {
      @apply flex-1 w-full max-w-2xl mx-auto max-sm:px-4;

      .ProseMirror-noderangeselection {
        *::selection {
          background: transparent;
        }

        * {
          caret-color: transparent;
        }
      }

      .ProseMirror-selectednode,
      .ProseMirror-selectednoderange {
        position: relative;
        outline: none;

        &::before {
          position: absolute;
          pointer-events: none;
          z-index: -1;
          content: '';
          top: -0.25rem;
          left: -0.25rem;
          right: -0.25rem;
          bottom: -0.25rem;
          background-color: #70CFF850;
          border-radius: 0.2rem;
        }
      }

      padding: 4rem 2rem 4rem 5rem;

      /* Heading styles */
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        line-height: 1.1;
        margin-top: 2.5rem;
        text-wrap: pretty;
      }

      h1,
      h2 {
        margin-top: 3.5rem;
        margin-bottom: 1.5rem;
      }

      h1 {
        font-size: 1.4rem;
      }

      h2 {
        font-size: 1.2rem;
      }

      h3 {
        font-size: 1.1rem;
      }

      h4,
      h5,
      h6 {
        font-size: 1rem;
      }

      .title {
        font-size: 3rem;
        font-weight: bold;
        position: relative;

        &::after {
          @apply bg-gray-300 rounded-full;
          content: '';
          position: absolute;
          top: -2px;
          bottom: -2px;
          left: -14px;
          width: 6px;
        }
      }

      /* Placeholder */
      &>.is-empty::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }

      b,
      strong {
        font-weight: 600;
      }

      dfn {
        font-style: italic;
      }

      hr {
        box-sizing: content-box;
        overflow: hidden;
        background: transparent;
        border-bottom: 1px solid #bfdbfeb3;
        height: .25em;
        padding: 0;
        margin: 1.5rem 0;
        background-color: #bfdbfe;
        border-radius: 9999px;
        border: 0;
      }

      hr::before {
        display: table;
        content: "";
      }

      hr::after {
        display: table;
        clear: both;
        content: "";
      }

      blockquote {
        margin: 0;
        padding: 0 1em;
        color: #59636e;
        border-left: .25em solid #bfdbfe;
      }

      ul {
        list-style: disc;
      }

      ol {
        list-style: decimal;
      }

      ul,
      ol {
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 2em;

        li::marker {
          color: #1d83ff;
        }
      }

      ol ol,
      ul ol {
        list-style-type: lower-roman;
      }

      ul ul ol,
      ul ol ol,
      ol ul ol,
      ol ol ol {
        list-style-type: lower-alpha;
      }

      ul ul,
      ul ol,
      ol ol,
      ol ul {
        margin-top: 0;
        margin-bottom: 0;
      }

      ol ul,
      ul ul {
        list-style-type: circle;
      }

      ul ul ul,
      ul ol ul,
      ol ul ul,
      ol ol ul {
        list-style-type: square;
      }

      li>p {
        margin-top: 1rem;
      }

      li+li {
        margin-top: .25em;
      }

      p,
      blockquote,
      ul,
      ol,
      dl,
      table,
      pre,
      details {
        margin-top: 0;
        margin-bottom: 1rem;
      }

      blockquote>:first-child {
        margin-top: 0;
      }

      blockquote>:last-child {
        margin-bottom: 0;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background-color: #adf;
        pointer-events: none;
      }

      .tableWrapper {
        @apply border-2 border-blue-2 my-3 min-w-0 w-fit max-w-100%;
        @apply rounded-8px overflow-y-hidden;

        table {
          @apply m-0 border-none border-separate;
          @apply relative w-full bg-white;
          border-spacing: 0;

          td,
          th {
            @apply relative box-border;
            @apply px-28px py-12px;
            @apply text-left align-middle;
          }

          th {
            @apply bg-blue-50/80;
            @apply text-blue-400 font-bold text-sm leading-32px;
            @apply overflow-hidden whitespace-nowrap text-ellipsis;
          }

          td:first-child,
          th:first-child {
            @apply pr-0 pl-24px;
          }

          td,
          th {
            @apply border-b-2 border-blue-2 border-r-2;

            &:last-child {
              @apply border-r-0;
            }
          }

          tr {
            @apply transition-colors relative;
          }

          tr:hover {
            @apply bg-blue-1/50;
          }

          tr:last-child td,
          tr:last-child th {
            @apply border-b-none;
          }
        }
      }
    }

    .ProseMirror-selectednode {
      outline: 2px solid lightblue;
    }


    [data-block-width="wide"] {
      @apply max-w-4xl !important;
    }

    [data-block-width="full"] {
      @apply max-w-none px-0 !important;
    }

    .ProseMirror:focus-visible {
      outline: none;
    }

    .ProseMirror>*:first-child {
      margin-top: 0;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}
</style>
