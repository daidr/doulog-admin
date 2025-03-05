import { Extension, type Editor, type Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

export default Extension.create({
  name: "commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: true,
        command: ({ editor, range, props }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.insertCommand({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
