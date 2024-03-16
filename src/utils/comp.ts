import { isVNode, type MaybeRefOrGetter, type VNode } from "vue";

export const RenderComponent = defineComponent((props: { node: MaybeRefOrGetter<string | VNode>, className: string }) => {
  return () => {
    if (isVNode(props.node)) {
      return props.node
    } else {
      const result = toValue(props.node);
      if (typeof result === 'string') {
        return h('span', {
          className: props.className,
        }, result)
      } else {
        return result
      }
    }
  }
}, {
  props: ['node', 'className']
})
