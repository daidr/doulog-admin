import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        'src/constants/**/*.{js,ts}',
        'src/composables/modals/**/*.{js,ts}',
      ],
    },
  },
})
