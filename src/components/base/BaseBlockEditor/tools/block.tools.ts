// @unocss-include

export const defaultBlockTools = function () {
  return [
    {
      name: "paragraph",
      title: "段落",
      icon: '<div class="i-ri-paragraph"></div>',
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
      convertCommand: (editor) => {
        editor.chain().focus().setParagraph().run();
      },
      canBeConverted: true,
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("paragraph"),
    },
    {
      title: "标题",
      name: "heading",
      icon: '<div class="i-ri-heading"></div>',
      insertCommand: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
      convertCommand: (editor) => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
      canBeConverted: true,
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("heading"),
      tools: [
        {
          title: "Heading 1",
          name: "heading1",
          icon: '<div class="i-ri-h-1"></div>',
          command: (editor) => {
            editor.chain().focus().setHeading({ level: 1 }).run();
          },
          isActiveTest: (editor) => editor.isActive("heading", { level: 1 }),
        },
        {
          title: "Heading 2",
          name: "heading2",
          icon: '<div class="i-ri-h-2"></div>',
          command: (editor) => {
            editor.chain().focus().setHeading({ level: 2 }).run();
          },
          isActiveTest: (editor) => editor.isActive("heading", { level: 2 }),
        },
        {
          title: "Heading 3",
          name: "heading3",
          icon: '<div class="i-ri-h-3"></div>',
          command: (editor) => {
            editor.chain().focus().setHeading({ level: 3 }).run();
          },
          isActiveTest: (editor) => editor.isActive("heading", { level: 3 }),
        },
        {
          title: "Heading 3",
          name: "heading3",
          icon: '<div class="i-ri-h-4"></div>',
          command: (editor) => {
            editor.chain().focus().setHeading({ level: 4 }).run();
          },
          isActiveTest: (editor) => editor.isActive("heading", { level: 4 }),
        },
        {
          title: "Heading 3",
          name: "heading3",
          icon: '<div class="i-ri-h-5"></div>',
          command: (editor) => {
            editor.chain().focus().setHeading({ level: 5 }).run();
          },
          isActiveTest: (editor) => editor.isActive("heading", { level: 5 }),
        },
        {
          title: "Heading 3",
          name: "heading3",
          icon: '<div class="i-ri-h-6"></div>',
          command: (editor) => {
            editor.chain().focus().setHeading({ level: 6 }).run();
          },
          isActiveTest: (editor) => editor.isActive("heading", { level: 6 }),
        },
      ],
    },
    {
      title: "列表",
      name: "list",
      icon: '<div class="i-ri-list-unordered"></div>',
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
      convertCommand: (editor) => {
        editor.chain().focus().toggleBulletList().run();
      },
      hasInlineTools: true,
      isActiveTest: (editor) =>
        editor.isActive("bulletList") || editor.isActive("orderedList"),
      tools: [
        {
          title: "Bullet list",
          name: "bulletList",
          icon: '<div class="i-ri-list-unordered"></div>',
          command: (editor) => {
            editor.chain().focus().toggleBulletList().run();
          },
          isActiveTest: (editor) => editor.isActive("bulletList"),
        },
        {
          title: "Ordered list",
          name: "orderedList",
          icon: '<div class="i-ri-list-ordered"></div>',
          command: (editor) => {
            editor.chain().focus().toggleOrderedList().run();
          },
          isActiveTest: (editor) => editor.isActive("orderedList"),
        },
        {
          title: "Sink list item",
          name: "sinklistitem",
          // icon: '<div class="i-ri-paragraph"></div>',
          icon: '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" focusable="false"><path d="M4 7.2v1.5h16V7.2H4zm8 8.6h8v-1.5h-8v1.5zm-8-3.5l3 3-3 3 1 1 4-4-4-4-1 1z"></path></svg>',
          command: (editor) => {
            editor.chain().focus().sinkListItem("listItem").run();
          },
          isDisabledTest: (editor) => !editor.can().sinkListItem("listItem"),
        },
        {
          title: "Lift list item",
          name: "liftlistitem",
          // icon: '<div class="i-ri-paragraph"></div>',
          icon: '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" focusable="false"><path d="M4 7.2v1.5h16V7.2H4zm8 8.6h8v-1.5h-8v1.5zm-4-4.6l-4 4 4 4 1-1-3-3 3-3-1-1z"></path></svg>',
          command: (editor) => {
            editor.chain().focus().liftListItem("listItem").run();
          },
          isDisabledTest: (editor) => !editor.can().liftListItem("listItem"),
        },
      ],
    },
    {
      title: "代码块",
      name: "codeBlock",
      icon: '<div class="i-ri-code-block"></div>',
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
      hasInlineTools: false,
      convertCommand: (editor) => {
        editor.chain().focus().toggleCodeBlock().run();
      },
      isActiveTest: (editor) => editor.isActive("codeBlock"),
    },
    {
      title: "引用",
      name: "blockquote",
      icon: '<div class="i-ri-double-quotes-l"></div>',
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
      hasInlineTools: true,
      canBeConverted: true,

      convertCommand: (editor) => {
        editor.chain().focus().toggleBlockquote().run();
      },
      isActiveTest: (editor) => editor.isActive("blockquote"),
    },
    {
      title: "分隔线",
      name: "horizontalRule",
      icon: '<div class="i-ri-page-separator"></div>',
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
      hasInlineTools: false,
      isActiveTest: (editor) => editor.isActive("horizontalRule"),
    },

    {
      title: "表格",
      name: "table",
      icon: '<div class="i-ri-table-3"></div>',
      insertCommand: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("table"),
      tools: [
        {
          title: "Toggle header row",
          name: "toggleHeaderRow",
          // icon: '<div class="i-ri-paragraph"></div>',
          icon: '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="21" height="16.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 21 16.5"><path stroke-linecap="round" stroke-linejoin="round" d="M1.875 15.75h17.25m-17.25 0A1.125 1.125 0 0 1 .75 14.625m1.125 1.125h3.381c.621 0 1.125-.504 1.125-1.125m-5.631 0V1.875m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V1.875m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75H7.506a1.125 1.125 0 0 1-1.125-1.125M20.25 1.875c0-.621-.504-1.125-1.125-1.125H1.875C1.254.75.75 1.254.75 1.875m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M.75 1.875v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h3.381c.748 0 1.125.504 1.125 1.125M1.875 4.5C1.254 4.5.75 5.004.75 5.625v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75H7.506c-.62 0-1.125.504-1.125 1.125M19.125 4.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h3.381m-3.381 0C1.254 8.25.75 8.754.75 9.375v1.5c0 .621.504 1.125 1.125 1.125m4.506-4.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125m1.125-1.125c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M7.506 8.25h11.619m-11.619 0c-.62 0-1.125.504-1.125 1.125M19.125 8.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h3.381m1.125-1.125v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125m1.125-1.125c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h11.619"/><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" d="M.737.877H20.212V4.182H.737z" /></svg>',
          command: (editor) => {
            editor.commands.toggleHeaderRow();
          },
        },
        {
          title: "Toggle header column",
          name: "toggleHeaderColumn",
          // icon: '<div class="i-ri-paragraph"></div>',
          icon: '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="21" height="16.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 21 16.5"><path stroke-linecap="round" stroke-linejoin="round" d="M1.875 15.75h17.25m-17.25 0A1.125 1.125 0 0 1 .75 14.625m1.125 1.125h3.381c.621 0 1.125-.504 1.125-1.125m-5.631 0V1.875m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V1.875m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75H7.506a1.125 1.125 0 0 1-1.125-1.125M20.25 1.875c0-.621-.504-1.125-1.125-1.125H1.875C1.254.75.75 1.254.75 1.875m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M.75 1.875v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h3.381c.748 0 1.125.504 1.125 1.125M1.875 4.5C1.254 4.5.75 5.004.75 5.625v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75H7.506c-.62 0-1.125.504-1.125 1.125M19.125 4.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h3.381m-3.381 0C1.254 8.25.75 8.754.75 9.375v1.5c0 .621.504 1.125 1.125 1.125m4.506-4.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125m1.125-1.125c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M7.506 8.25h11.619m-11.619 0c-.62 0-1.125.504-1.125 1.125M19.125 8.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h3.381m1.125-1.125v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125m1.125-1.125c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h11.619"/><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" d="M.737.877H7.042V15.369000000000002H.737z" /></svg>',
          command: (editor) => {
            editor.commands.toggleHeaderColumn();
          },
        },
        {
          title: "Merge or split cells",
          name: "mergeOrSplit",
          // icon: '<div class="i-ri-paragraph"></div>',
          icon: '<svg class="w-5 h-5 md:w-6 md:h-6" fill="none" height="21" width="21" viewBox="0 0 48 48" stroke="currentColor" width="48" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><g stroke-linecap="round" stroke-width="4"><path d="m20 14v-9c0-.55228-.4477-1-1-1h-14c-.55228 0-1 .44772-1 1v38c0 .5523.44772 1 1 1h14c.5523 0 1-.4477 1-1v-9"/><path d="m28 34v9c0 .5523.4477 1 1 1h14c.5523 0 1-.4477 1-1v-38c0-.55228-.4477-1-1-1h-14c-.5523 0-1 .44772-1 1v9"/><path d="m28 24h16"/><path d="m5 24h15"/><path d="m32.7485 28.8183-1.591-1.5909-3.1819-3.182 3.1819-3.182 1.591-1.591" stroke-linejoin="round"/><path d="m15.375 28.8183 1.591-1.5909 3.182-3.182-3.182-3.182-1.591-1.591" stroke-linejoin="round"/></g></svg>',
          command: (editor) => {
            editor.commands.mergeOrSplit();
          },
        },
      ],
    },
    // {
    //   title: "YouTube",
    //   name: "youtube",
    //   icon: '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24" version="1.1" viewBox="0 0 461.001 461.001"><path fill="currentColor" d="M365.257 67.393H95.744C42.866 67.393 0 110.259 0 163.137v134.728c0 52.878 42.866 95.744 95.744 95.744h269.513c52.878 0 95.744-42.866 95.744-95.744V163.137c0-52.878-42.866-95.744-95.744-95.744zm-64.751 169.663-126.06 60.123c-3.359 1.602-7.239-.847-7.239-4.568V168.607c0-3.774 3.982-6.22 7.348-4.514l126.06 63.881c3.748 1.899 3.683 7.274-.109 9.082z"/></svg>',
    //   hasInlineTools: false,
    //   canBeConverted: false,
    //   isActiveTest: (editor) => editor.isActive("youtube"),
    // },
  ];
}
